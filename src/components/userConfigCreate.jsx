import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const UserConfigCreate = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          // Send a POST request using Axios
          const response = await axios.post('http://localhost:9090/api/v1/user/onboard', values);

          if (response.data.success) {
            // Optionally handle success response
            console.log('User created successfully:', response.data.data);
          } else {
            // Handle error response
            console.error('Error creating user:', response.data.message);
          }
        } catch (error) {
          // Handle network or other errors
          console.error('Error creating user:', error);
        } finally {
          setLoading(false);
          setOpen(false);
          form.resetFields();
        }
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', marginRight: '30px' }}>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={showModal}
        >
          Add New
        </Button>
      </div>
      <Modal
        visible={open}
        title="Add/Edit User"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter the username' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter the password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input placeholder="Phone" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="userType"
            label="User Type"
            rules={[{ required: true, message: 'Please select the user type' }]}
          >
            <Select placeholder="Select User Type" defaultValue="User">
              <Option value="User">User</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserConfigCreate;
