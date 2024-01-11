import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Drawer, Form, Input, Row, Col, Select, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const { Option } = Select;

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [deleteUserId, setDeleteUserId] = useState(null);

  const HOSTNAME = 'http://localhost:9090/api/v1';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(HOSTNAME+'/user');
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
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
    setSelectedUser(null);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          let response;

          if (selectedUser === null) {
            // If selectedUser is null, it's a create operation (POST request)
            response = await axios.post(HOSTNAME+'/user/onboard', values);
          } else {
            // If selectedUser is not null, it's an edit operation (PUT request)
            response = await axios.put(HOSTNAME+`/user/${selectedUser.id}`, values);
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
    // Set the selected user for editing and show the Drawer
    setSelectedUser(record);
    showDrawer();

    // Fetch the details of the selected user and update the form fields
    const userId = record.id; // Assuming the id property exists in the userData object
    try {
      console.log('Fetching user details for userId:', userId);
      await fetchUserDetails(userId);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Error fetching user details. Please try again later.', { position: 'bottom-left' });
    } finally {
      setLoading(false); // Uncomment this line if you need to set loading to false here
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(HOSTNAME+`/user/${userId}`);
      const userDetails = response.data.data; // Access the 'data' property

      console.log('user-details:', userDetails);

      // Update the form fields with the details of the selected user
      form.setFieldsValue({
        name: userDetails.name,
        username: userDetails.username,
        phone: userDetails.phone,
        email: userDetails.email,
        userType: userDetails.userType, // Assuming usertype is the field for User Type
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Error fetching user details. Please try again later.', { position: 'bottom-left' });
    }
  };

  const handleDelete = (record) => {
    if ('id' in record && record.id !== null) {
      setDeleteUserId(record.id);
      showDeleteConfirm(record.name, record.id); // Pass the record.id to showDeleteConfirm
    } else {
      console.error('Invalid record object or missing id property:', record);
    }
  };

  const showDeleteConfirm = (userName, userId) => { // Receive userId as a parameter
    Modal.confirm({
      title: `Confirm Delete`,
      content: `Are you sure you want to delete ${userName}?`,
      onOk: () => handleConfirmDelete(userId), // Pass userId to handleConfirmDelete
      onCancel: () => setDeleteUserId(null),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleConfirmDelete = async (userId) => { // Receive userId as a parameter
    try {
      const response = await axios.delete(HOSTNAME+`/user/${userId}`);
      if (response.data.success) {
        toast.success(response.data.message, { position: 'bottom-left' });
        fetchData();
      } else {
        toast.error(response.data.message, { position: 'bottom-left' });
      }
    } catch (error) {
      toast.error('Error deleting user. Please try again later.', { position: 'bottom-left' });
    } finally {
      setDeleteUserId(null);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    //   key: 'phone',
    // },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    {
      title: 'User Type',
      dataIndex: 'userType', // Assuming userType is the field for User Type
      key: 'userType',
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
      <h1 style={{marginBlockStart:-20}}>User Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: 'right', marginRight: 30 }}
        onClick={showDrawer}
      >
        Add New
      </Button>

      <Drawer
        title={selectedUser != null ? 'Edit User' : 'Create a new user'}
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
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the name',
                  },
                ]}
              >
                <Input placeholder="Please enter name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the username',
                  },
                ]}
              >
                <Input placeholder="Please enter username" />
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
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the email',
                  },
                ]}
              >
                <Input placeholder="Please enter email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userType"  // Assuming userType is the field for User Type
                label="User Type"
                rules={[
                  {
                    required: true,
                    message: 'Please select the user type',
                  },
                ]}
              >
                <Select placeholder="Please select user type">
                  <Option value="Admin">Admin</Option>
                  <Option value="User">User</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Table columns={columns} dataSource={userData} />
      <ToastContainer />
    </>
  );
};

export default UserManagement;
