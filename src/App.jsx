import React, { useState, useEffect } from "react";
import { message } from "antd";
import { CssBaseline, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import StoreIcon from "@mui/icons-material/Store";
import FactoryIcon from "@mui/icons-material/Factory";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import logo from "./images/bird-script-icon.png";
import { Divider } from "@mui/material";
import "./App.css";

import {
  Drawer as MuiDrawer,
  List as MuiList,
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  Typography as MuiTypography,
  IconButton as MuiIconButton,
  Box as MuiBox,
} from "@mui/material";

const drawerWidth = 195;
const appBarWidth = 8; // Assuming sm breakpoint is suitable for your design

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [drawerVariant, setDrawerVariant] = useState(
    window.innerWidth < 600 ? "temporary" : "permanent"
  );

  useEffect(() => {
    const handleResize = () => {
      setDrawerVariant(window.innerWidth < 600 ? "temporary" : "permanent");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const [temporaryDrawerZIndex, setTemporaryDrawerZIndex] = useState(0);

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon color="primary" />,
      path: "/dashboard",
    },
    { text: "User", icon: <PeopleIcon color="primary" />, path: "/user" },
    { text: "Vendor", icon: <StoreIcon color="primary" />, path: "/vendor" },
    {
      text: "Supplier",
      icon: <FactoryIcon color="primary" />,
      path: "/supplier",
    },
    {
      text: "Product",
      icon: <ProductionQuantityLimitsIcon color="primary" />,
      path: "/product",
    },
    {
      text: "Purchase Entry",
      icon: <ShoppingBasketIcon color="primary" />,
      path: "/purchase-entry",
    },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.setItem("loggedIn", false);
    message.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MuiAppBar
        position="fixed"
        color="primary"
        sx={{
          width: "100%",
          zIndex: 1000,
        }}
      >
        <MuiToolbar sx={{ justifyContent: "space-between" }}>
          <MuiIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </MuiIconButton>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                marginLeft: -18,
                marginRight: 3,
                width: "auto",
                height: 30,
              }}
            />
            <MuiTypography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontFamily: "Helvetica Neue" }}
            >
              NewCityTraders
            </MuiTypography>
          </div>
          <Toolbar>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </MuiToolbar>
      </MuiAppBar>
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
          style: { zIndex: temporaryDrawerZIndex }, // Set zIndex dynamically
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            marginRight: 0, // Updated based on your requirement
            marginTop: appBarWidth - 1,
          },
        }}
      >
        <MuiList>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <MuiListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{ paddingLeft: 2, paddingRight: 2 }}
              >
                <MuiListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
                  {item.icon}
                </MuiListItemIcon>
                <MuiListItemText primary={item.text} sx={{ fontFamily: "Helvetica Neue" }}/>
              </MuiListItemButton>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </MuiList>
      </MuiDrawer>
      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            marginTop: appBarWidth - 1,
            zIndex: 1, // Set zIndex higher than temporary drawer
          },
        }}
        open
      >
        <MuiList>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <MuiListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{ paddingLeft: 2, paddingRight: 2 }}
              >
                <MuiListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
                  {item.icon}
                </MuiListItemIcon>
                <MuiListItemText primary={item.text} sx={{ fontFamily: "Helvetica Neue" }}/>
              </MuiListItemButton>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </MuiList>
      </MuiDrawer>
      <MuiBox
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: drawerVariant === "temporary" ? 0 : `${drawerWidth}px`,
          // marginLeft:0
        }}
      >
        <MuiToolbar />
        {children}
      </MuiBox>
    </Box>
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
