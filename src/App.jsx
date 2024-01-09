import React, { useState } from "react";
import { Layout, Menu, Button, theme, message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AreaChartOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ContainerOutlined,
  HeartTwoTone,
  LogoutOutlined,
} from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Vendor from "./components/vendor";
import ProductManagement from "./components/productmanagement";
import UserManagement from "./components/usermanagement";
import SupplierManagement from "./components/suppliermanagement";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import PurchaseEntry from "./components/PurchaseEntry";
import PrivateRoutes from "./Utils/PrivateRoutes";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.setItem("loggedIn", false);
    message.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* <Avatar src={url}  NewCityTraders size={50} shape="square" style={{ marginLeft:60 }}/> */}
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<AreaChartOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/user">User</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ShopOutlined />}>
            <Link to="/vendor">Vendor</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ContainerOutlined />}>
            <Link to="/supplier">Supplier</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ShoppingCartOutlined />}>
            <Link to="/product">Product</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<ShoppingCartOutlined />}>
            <Link to="/purchase-entry">Purchase Entry</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        {/* Header */}
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          {/* Spacer to push the logout button to the right corner */}
          <div style={{ flex: 1 }} />

          {/* Logout Button */}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              fontSize: "16px",
              marginRight: 16,
            }}
          >
            Logout
          </Button>
        </Header>

        {/* Content */}
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: "calc(100vh - 128px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          New City Traders ©2024 Powered by DW with{" "}
          <HeartTwoTone twoToneColor="#eb2f96" />
        </Footer>
      </Layout>
    </Layout>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginSuccess = (status) => {
    setLoggedIn(status);
  };

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes loggedIn={loggedIn} />}>
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
            exact
          />
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/user"
            element={
              <AppLayout>
                <UserManagement />
              </AppLayout>
            }
          />
          <Route
            path="/vendor"
            element={
              <AppLayout>
                <Vendor />
              </AppLayout>
            }
          />
          <Route
            path="/supplier"
            element={
              <AppLayout>
                <SupplierManagement />
              </AppLayout>
            }
          />
          <Route
            path="/product"
            element={
              <AppLayout>
                <ProductManagement />
              </AppLayout>
            }
          />
          <Route
            path="/purchase-entry"
            element={
              <AppLayout>
                <PurchaseEntry />
              </AppLayout>
            }
          />
        </Route>
        <Route
          element={<Login onLoginSuccess={handleLoginSuccess} />}
          path="/login"
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
