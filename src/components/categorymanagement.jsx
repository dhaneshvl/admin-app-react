import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Drawer, Form, Input, Row, Col, message, Modal, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const CategoryManagement = () => {
  const [open, setOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/category');
      const result = await response.json();

      if (result.success) {
        setCategoryData(result.data);
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
    setSelectedCategory(null);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          let response;

          if (selectedCategory === null) {
            // If selectedCategory is null, it's a create operation (POST request)
            response = await axios.post('http://localhost:9090/api/v1/category/create', values);
          } else {
            // If selectedCategory is not null, it's an edit operation (PUT request)
            response = await axios.put(`http://localhost:9090/api/v1/category/${selectedCategory.id}`, values);
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
    // Set the selected category for editing and show the Drawer
    setSelectedCategory(record);
    showDrawer();

    // Fetch the details of the selected category and update the form fields
    const categoryId = record.id; // Assuming the id property exists in the categoryData object
    try {
      await fetchCategoryDetails(categoryId);
    } catch (error) {
      // Handle errors
    }
  };

  const fetchCategoryDetails = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/v1/category/${categoryId}`);
      const categoryDetails = response.data.data;

      // Update the form fields with the details of the selected category
      form.setFieldsValue({
        categoryName: categoryDetails.categoryName,
        description: categoryDetails.description,
        gst: categoryDetails.gst,
        sgst: categoryDetails.sgst,
        quantity: categoryDetails.quantity,
      });
    } catch (error) {
      // Handle errors
    }
  };

  const handleDelete = (record) => {
    if ('id' in record && record.id !== null) {
      setDeleteCategoryId(record.id);
      showDeleteConfirm(record.categoryName, record.id);
    } else {
      console.error('Invalid record object or missing id property:', record);
    }
  };

  const showDeleteConfirm = (categoryName, categoryId) => {
    Modal.confirm({
      title: `Confirm Delete`,
      content: `Are you sure you want to delete ${categoryName}?`,
      onOk: () => handleConfirmDelete(categoryId),
      onCancel: () => setDeleteCategoryId(null),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleConfirmDelete = async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:9090/api/v1/category/${categoryId}`);
      if (response.data.success) {
        toast.success(response.data.message, { position: 'bottom-left' });
        fetchData();
      } else {
        toast.error(response.data.message, { position: 'bottom-left' });
      }
    } catch (error) {
      // Handle errors
    } finally {
      setDeleteCategoryId(null);
    }
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'GST (%)',
      dataIndex: 'gst',
      key: 'gst',
    },
    {
      title: 'SGST (%)',
      dataIndex: 'sgst',
      key: 'sgst',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      key: 'addedDate',
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
      <h1 style={{marginBlockStart:-20}}>Category Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: 'right', marginRight: 30 }}
        onClick={showDrawer}
      >
        Add New
      </Button>

      <Drawer
        title={selectedCategory !== null ? 'Edit Category' : 'Create a new category'}
        width={720}
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
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryName"
                label="Category Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the category name',
                  },
                ]}
              >
                <Input placeholder="Please enter category name" allowClear/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the description',
                  },
                ]}
              >
                <Input.TextArea placeholder="Please enter description" allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gst"
                label="GST (%)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the GST',
                  },
                ]}
              >
                <Input placeholder="Please enter GST" allowClear/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sgst"
                label="SGST (%)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the SGST',
                  },
                ]}
              >
                <Input placeholder="Please enter SGST" allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  {
                    required: true,
                    message: 'Please select the quantity unit',
                  },
                ]}
              >
                <Select placeholder="Please select quantity unit" >
                  <Select.Option value="Pcs">Pcs</Select.Option>
                  <Select.Option value="Ltr">Ltr</Select.Option>
                  <Select.Option value="Kg">Kg</Select.Option>
                  <Select.Option value="Grams">g</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      {/* <Table columns={columns} dataSource={categoryData} /> */}
      <Table columns={columns} dataSource={Array.isArray(categoryData) ? categoryData : []} />

      <ToastContainer />
    </>
  );
};

export default CategoryManagement;
