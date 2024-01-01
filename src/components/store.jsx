import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Drawer, Form, Input, Row, Col, Select, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import './css/store.css';

const { Option } = Select;

const Store = () => {
  const [open, setOpen] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null); // New state to store selected store for editing
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [deleteStoreId, setDeleteStoreId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/store');
      const result = await response.json();

      if (result.success) {
        setStoreData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const showDrawer = () => {
    setOpen(true);
    form.resetFields(); // Clear the form fields
  };

  const onClose = () => {
    setOpen(false);
    setSelectedStore(null); // just testing
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          let response;

          if (selectedStore === null) {
            // If selectedStore is null, it's a create operation (POST request)
            response = await axios.post('http://localhost:9090/api/v1/store/onboard', values);
          } else {
            // If selectedStore is not null, it's an edit operation (PUT request)
            response = await axios.put(`http://localhost:9090/api/v1/store/${selectedStore.id}`, values);
          }

          const responseData = response.data;

          if (responseData.success) {
            toast.success(responseData.message, { position: 'bottom-left' });
            fetchData();
            onClose();
          } else {
            toast.error(responseData.message, { position: 'bottom-left' });
          }
        } catch (error) {
          if (error.response) {
            // Server responded with an error status (4xx or 5xx)
            console.error('Server error:', error.response.status, error.response.data);
            toast.error(error.response.data.message, { position: 'bottom-left' });
          } else {
            // Request was made but no response received
            console.error('Request error:', error.request);
            toast.error('No response received from the server.', { position: 'bottom-left' });
          }
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle validation errors or other form errors here
        console.error('Form validation errors:', error.errors);
        toast.error('Error submitting data. Please fix the validation errors and try again.', { position: 'bottom-left' });
        setLoading(false);
      });
  };


  const handleEdit = async (record) => {
    // Set the selected store for editing and show the Drawer
    setSelectedStore(record);
    showDrawer();

    // Fetch the details of the selected store and update the form fields
    const storeId = record.id; // Assuming the id property exists in the storeData object
    try {
      console.log('Fetching store details for storeId:', storeId);
      await fetchStoreDetails(storeId);
    } catch (error) {
      console.error('Error fetching store details:', error);
      toast.error('Error fetching store details. Please try again later.', { position: 'bottom-left' });
    } finally {
      // setLoading(false); // Uncomment this line if you need to set loading to false here
    }
  };



  const fetchStoreDetails = async (storeId) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/v1/store/${storeId}`);
      const storeDetails = response.data.data; // Access the 'data' property

      console.log('store-details:', storeDetails);

      // Update the form fields with the details of the selected store
      form.setFieldsValue({
        name: storeDetails.name,
        proprietorName: storeDetails.proprietorName,
        location: storeDetails.location,
        pincode: storeDetails.pincode,
        phone: storeDetails.phone,
      });
    } catch (error) {
      console.error('Error fetching store details:', error);
      toast.error('Error fetching store details. Please try again later.', { position: 'bottom-left' });
    }
  };


  const handleDelete = (record) => {
    if ('id' in record && record.id !== null) {
      setDeleteStoreId(record.id);
      showDeleteConfirm(record.name, record.id); // Pass the record.id to showDeleteConfirm
    } else {
      console.error('Invalid record object or missing id property:', record);
    }
  };

  const showDeleteConfirm = (storeName, storeId) => { // Receive storeId as a parameter
    Modal.confirm({
      title: `Confirm Delete`,
      content: `Are you sure you want to delete ${storeName}?`,
      onOk: () => handleConfirmDelete(storeId), // Pass storeId to handleConfirmDelete
      onCancel: () => setDeleteStoreId(null),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleConfirmDelete = async (storeId) => { // Receive storeId as a parameter
    try {
      const response = await axios.delete(`http://localhost:9090/api/v1/store/${storeId}`);
      if (response.data.success) {
        toast.success(response.data.message, { position: 'bottom-left' });
        fetchData();
      } else {
        toast.error(response.data.message, { position: 'bottom-left' });
      }
    } catch (error) {
      toast.error('Error deleting store. Please try again later.', { position: 'bottom-left' });
    } finally {
      setDeleteStoreId(null);
    }
  };

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Proprietor Name',
      dataIndex: 'proprietorName',
      key: 'proprietorName',
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      key: 'addedDate',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Pincode',
      dataIndex: 'pincode',
      key: 'pincode',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined /> </a>
          <a onClick={() => handleDelete(record)}><DeleteOutlined /></a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Store Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: 'right', marginRight: 30 }}
        onClick={showDrawer}
      >
        Add New
      </Button>

      <Drawer
        title={selectedStore!=null? 'Edit Store' : 'Create a new store'}
        width={720}
        onClose={onClose}
        visible={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button key="submit" type="primary" loading={loading} onClick={handleFormSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Store Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the store name',
                  },
                ]}
              >
                <Input placeholder="Please enter store name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="proprietorName"
                label="Proprietor Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the proprietor name',
                  },
                ]}
              >
                <Input placeholder="Please enter proprietor name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the location',
                  },
                ]}
              >
                <Input placeholder="Please enter location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the pincode',
                  },
                ]}
              >
                <Input placeholder="Please enter pincode" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the phone number',
                  },
                ]}
              >
                <Input placeholder="Please enter phone number" />
              </Form.Item>
            </Col>
            {/* Add other form fields similarly */}
          </Row>
        </Form>
      </Drawer>

      <Table columns={columns} dataSource={storeData} />
      <ToastContainer />
    </>
  );
};

export default Store;
