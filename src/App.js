import React, { useState } from 'react';
import { Layout, Menu, Button, theme} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AreaChartOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ContainerOutlined,
  HeartTwoTone
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Store from './components/store';
import ProductManagement from './components/productmanagement';
import UserManagement from './components/usermanagement';
import CategoryManagement from './components/categorymanagement';

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<AreaChartOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/user">User</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ShopOutlined />}>
            <Link to="/store">Store</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ContainerOutlined />}>
            <Link to="/category">Category</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ShoppingCartOutlined />}>
            <Link to="/product">Product</Link>
          </Menu.Item>
        </Menu>

{/* <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={[
  { key: '1', icon: <AreaChartOutlined />, children: <Link to="/">Dashboard</Link> },
  { key: '2', icon: <UserOutlined />, children: <Link to="/user">User</Link> },
  { key: '3', icon: <AreaChartOutlined />, children: <Link to="/store">Store</Link> },
  { key: '4', icon: <AreaChartOutlined />, children: <Link to="/category">Category</Link> },
  { key: '5', icon: <AreaChartOutlined />, children: <Link to="/product">Product</Link> },
]} /> */}
      </Sider>

      <Layout className="site-layout">
        {/* Header */}
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>

        {/* Content */}
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: 'calc(100vh - 128px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          New City Traders ©2024 Powered by DW with <HeartTwoTone twoToneColor="#eb2f96" />

        </Footer>
      </Layout>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/user" element={<AppLayout><UserManagement /></AppLayout>} />
        <Route path="/store" element={<AppLayout><Store /></AppLayout>} />
        <Route path="/category" element={<AppLayout><CategoryManagement /></AppLayout>} />
        <Route path="/product" element={<AppLayout><ProductManagement /></AppLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
