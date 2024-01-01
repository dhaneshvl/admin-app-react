import React, { useEffect, useState } from 'react';
import { Space, Table, Alert } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserConfigCreate from './userConfigCreate'; // Import the UserConfigCreate component
import './css/spinner.css'; // Adjust the path accordingly

const UserConfig = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  
    useEffect(() => {
      // Fetch data when the component mounts
      fetchData();
    }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/user');
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
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
          <a><EditOutlined /></a>
          <a><DeleteOutlined /></a>
        </Space>
      ),
    },
  ];

  // const openCreateModal = () => {
  //   setCreateModalVisible(true);
  // };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1>User Management</h1>

      {/* <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', marginRight: '30px' }}>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={openCreateModal}
        >
          Add New
        </Button>
      </div> */}

      <UserConfigCreate visible={isCreateModalVisible} onCancel={closeCreateModal} />

      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}
      {error && <Alert message={error} type="error" showIcon />}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <Table columns={columns} dataSource={userData} />
        </div>
      )}

    </div>
  );
};

export default UserConfig;
