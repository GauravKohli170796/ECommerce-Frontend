import { createTheme, ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { GetAppState } from "./AppContext";
import AdminController from "./components/adminController/AdminController";
import ChangePassword from "./components/auth/ChangePassword";
import Login from "./components/auth/Login";
import Otp from "./components/auth/Otp";
import SignUp from "./components/auth/SignUp";
import CartList from "./components/cart/CartList";
import WishList from "./components/cart/WishList";
import Checkout from "./components/checkout/Checkout";
import Drawer from "./components/drawer/Drawer";
import Loader from "./components/loader/Loader";
import AllProducts from "./components/product/AllProducts";
import ProductDetail from "./components/product/ProductDetail";
import { notificationType } from "./constants/AppConst";
import { axiosInstance } from "./services/axiosInstance";
import { showNotificationMsg } from "./services/createNotification";

function App() {
  const AppState = GetAppState();
  const navigate = useNavigate();
  axiosInstance.interceptors.request.use((config) => {
    AppState?.setLoading(true);
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate])

  axiosInstance.interceptors.response.use(
    response => {
      AppState?.setLoading(false);
      return response
    },
    error => {
      AppState?.setLoading(false);
      showNotificationMsg(error.response?.data?.message || "Something went wrong.", notificationType.DANGER);
    });
    
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          shrink: {
            color: "#880E4F",
            marginX: "16px"
          }
        }
      },
      MuiSpeedDialAction: {
        styleOverrides: {
          staticTooltipLabel: {
            backgroundColor: '#9c27b0',
            color: "white"
          },
        }
      },
     MuiButton:{
      defaultProps:{
        disableRipple:true,
        disableTouchRipple:true
      }
     } 
    },
    typography: {
      fontFamily: [
        'Jost',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },

  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Drawer></Drawer>
        <ReactNotifications />
        <Loader isVisible={AppState?.loading} />
        <Routes>
          <Route path="/product/showProducts" element={<AllProducts />} />
        </Routes>
        <Routes>
          <Route path="/product/productDetail/:id" element={<ProductDetail />} />
        </Routes>
        <Routes>
          <Route path="/user/wishlist" element={<WishList />} />
        </Routes>
        <Routes>
          <Route path="/user/shoppingCart" element={<CartList />} />
        </Routes>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/auth/signup" element={<SignUp />} />
        </Routes>
        <Routes>
          <Route path="/admin/adminController" element={<AdminController />} />
        </Routes>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Routes>
          <Route path="/auth/get-otp" element={<Otp />} />
        </Routes>
        <Routes>
          <Route path="/auth/change-password" element={<ChangePassword />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
