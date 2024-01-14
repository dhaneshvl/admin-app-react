import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Drawer, Form, Input, Row, Col, Select, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import './css/vendor.css';

const { Option } = Select;

const Vendor = () => {
  const [open, setOpen] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null); // New state to vendor selected vendor for editing
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [deleteVendorId, setDeleteVendorId] = useState(null);

  const HOSTNAME = 'http://localhost:9090/api/v1';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(HOSTNAME+'/vendor');
      const result = await response.json();

      if (result.success) {
        setVendorData(result.data);
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
    setSelectedVendor(null); // just testing
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          let response;

          if (selectedVendor === null) {
            // If selectedVendor is null, it's a create operation (POST request)
            response = await axios.post(HOSTNAME+'/vendor/onboard', values);
          } else {
            // If selectedStore is not null, it's an edit operation (PUT request)
            response = await axios.put(HOSTNAME+`/vendor/${selectedVendor.id}`, values);
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
    // Set the selected vendor for editing and show the Drawer
    setSelectedVendor(record);
    showDrawer();

    // Fetch the details of the selected store and update the form fields
    const vendorId = record.id; // Assuming the id property exists in the storeData object
    try {
      console.log('Fetching vendor details for vendorId:', vendorId);
      await fetchVendorDetails(vendorId);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast.error('Error fetching vendor details. Please try again later.', { position: 'bottom-left' });
    } finally {
      // setLoading(false); // Uncomment this line if you need to set loading to false here
    }
  };



  const fetchVendorDetails = async (vendorId) => {
    try {
      const response = await axios.get(HOSTNAME+`/vendor/${vendorId}`);
      const vendorDetails = response.data.data; // Access the 'data' property

      console.log('vendor-details:', vendorDetails);

      // Update the form fields with the details of the selected vendor
      form.setFieldsValue({
        name: vendorDetails.name,
        proprietorName: vendorDetails.proprietorName,
        gstNo:vendorDetails.gstNo,
        address: vendorDetails.address,
        pincode: vendorDetails.pincode,
        phone: vendorDetails.phone,
      });
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast.error('Error fetching vendor details. Please try again later.', { position: 'bottom-left' });
    }
  };


  const handleDelete = (record) => {
    if ('id' in record && record.id !== null) {
      setDeleteVendorId(record.id);
      showDeleteConfirm(record.name, record.id); // Pass the record.id to showDeleteConfirm
    } else {
      console.error('Invalid record object or missing id property:', record);
    }
  };

  const showDeleteConfirm = (vendorName, vendorId) => { // Receive storeId as a parameter
    Modal.confirm({
      title: `Confirm Delete`,
      content: `Are you sure you want to delete ${vendorName}?`,
      onOk: () => handleConfirmDelete(vendorId), // Pass vendorId to handleConfirmDelete
      onCancel: () => setDeleteVendorId(null),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleConfirmDelete = async (vendorId) => { // Receive vendorId as a parameter
    try {
      const response = await axios.delete(HOSTNAME+`/vendor/${vendorId}`);
      if (response.data.success) {
        toast.success(response.data.message, { position: 'bottom-left' });
        fetchData();
      } else {
        toast.error(response.data.message, { position: 'bottom-left' });
      }
    } catch (error) {
      toast.error('Error deleting vendor. Please try again later.', { position: 'bottom-left' });
    } finally {
      setDeleteVendorId(null);
    }
  };

  const columns = [
    {
      title: 'Vendor Name',
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
    // {
    //   title: 'GST NO',
    //   dataIndex: 'gstNo',
    //   key: 'gstBo',
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    // {
    //   title: 'Pincode',
    //   dataIndex: 'pincode',
    //   key: 'pincode',
    // },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    //   key: 'phone',
    // },
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
      <h1 style={{marginBlockStart:-20}}>Vendor Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: 'right', marginRight: 30 }}
        onClick={showDrawer}
      >
        Add New
      </Button>

      <Drawer
        title={selectedVendor!=null? 'Edit Vendor' : 'Create a new vendor'}
        width={600}
        onClose={onClose}
        open={open} 
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button key="submit" type="primary" loading={loading} onClick={handleFormSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
         <Form form={form} layout="vertical" size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Vendor Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the vendor name',
                  },
                ]}
              >
                <Input placeholder="Please enter vendor name" />
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
                name="address"
                label="Address"
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
            <Col span={12}>
              <Form.Item
                name="gstNo"
                label="GST NO"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the GST number',
                  },
                ]}
              >
                <Input placeholder="Please enter GST number" />
              </Form.Item>
            </Col>
            {/* Add other form fields similarly */}
          </Row>
        </Form>
      </Drawer>

      {/* <Table columns={columns} dataSource={storeData} /> */}
      <Table columns={columns} dataSource={Array.isArray(vendorData) ? vendorData : []} />

      <ToastContainer />
    </>
  );
};

export default Vendor;
