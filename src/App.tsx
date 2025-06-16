import { createTheme, ThemeProvider } from "@mui/material";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import React, { useEffect } from "react";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { GetAppState } from "./AppContext";
import AddressOrder from "./components/address/Address";
import AdminController from "./components/adminController/AdminController";
import ChangePassword from "./components/auth/ChangePassword";
import Login from "./components/auth/Login";
import Otp from "./components/auth/Otp";
import SignUp from "./components/auth/SignUp";
import CartList from "./components/cart/CartList";
import WishList from "./components/cart/WishList";
import Drawer from "./components/drawer/Drawer";
import Loader from "./components/loader/Loader";
import Orders from "./components/order/Orders";
import AllProducts from "./components/product/AllProducts";
import ProductDetail from "./components/product/ProductDetail";
import { AppConst, notificationType } from "./constants/AppConst";
import { renewAccessToken } from "./services/authService";
import { axiosInstance, axiosProtectedInstance } from "./services/axiosInstance";
import { showNotificationMsg } from "./services/createNotification";
import AddWalkPadData from "./components/fitness/addWalkPadData";
import FitnessMetrics from "./components/fitness/fitnessMetrics";

function App() {
  const AppState = GetAppState();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate])

  axiosInstance.interceptors.request.use((config) => {
    AppState?.setLoading(true);
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  axiosInstance.interceptors.response.use(
    response => {
      AppState?.setLoading(false);
      return response
    },
    error => {
      AppState?.setLoading(false);
      showNotificationMsg(error.response?.data?.message || "Something went wrong.", notificationType.DANGER);
    });

  axiosProtectedInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const authToken = localStorage.getItem(AppConst.storageKeys.accessToken);
      if (authToken) {
        (config.headers as AxiosRequestHeaders)["Authorization"] = `Bearer ${authToken}`;
      }
      AppState?.setLoading(true);
      return config;
    },
    (error) => {
      AppState?.setLoading(false);
      showNotificationMsg(error.response?.data?.message || "Something went wrong.", notificationType.DANGER);
    });

  axiosProtectedInstance.interceptors.response.use(
    response => {
      AppState?.setLoading(false);
      return response
    },
    async (error) => {
      if (error.response.data.status === 401 && error.response.data.message === "jwt expired") {
        const refreshToken = localStorage.getItem(AppConst.storageKeys.refreshToken);
        if (!refreshToken) {
          AppState?.setLoading(false);
          showNotificationMsg(error.response?.data?.message || "Something went wrong.", notificationType.DANGER);
          return;
        }
        const { data } = await renewAccessToken(refreshToken);
        localStorage.setItem(AppConst.storageKeys.accessToken, data);
        error.response.config.headers!.Authorization = `Bearer ${data}`;
        return axios(error.response.config);
      }
      else {
        AppState?.setLoading(false);
        showNotificationMsg(error.response?.data?.message || "Something went wrong.", notificationType.DANGER);
      }
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
            color: "white",
            whiteSpace: "nowrap"
          },
        }
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true
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
          <Route path="/" element={<FitnessMetrics />} />
        </Routes>
        <Routes>
          <Route path="/product/showProducts" element={<AllProducts />} />
        </Routes>
        <Routes>
          <Route path="/fitness/addFitnessData" element={<AddWalkPadData />} />
        </Routes>
        <Routes>
          <Route path="/fitness/getMyFitnessMetrics" element={<FitnessMetrics />} />
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
          <Route path="/manage-address" element={<AddressOrder />} />
        </Routes>
        <Routes>
          <Route path="/auth/get-otp" element={<Otp />} />
        </Routes>
        <Routes>
          <Route path="/auth/change-password" element={<ChangePassword />} />
        </Routes>
        <Routes>
          <Route path="/orders/my-orders" element={<Orders />} />
        </Routes>
        {/* <Routes>
          <Route path="*" element={<AllProducts />} />
        </Routes> */}
      </ThemeProvider>
    </div>
  );
}

export default App;
