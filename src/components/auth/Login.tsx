import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import { Button, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useGoogleLogin } from '@react-oauth/google';
import { AxiosResponse } from 'axios';
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { AppConst, notificationType } from '../../constants/AppConst';
import { IForgotPasswordForm, ILogInForm } from '../../models/authModels';
import { EmailTypes } from '../../models/commanModel';
import { checkUser } from '../../services/authService';
import { axiosInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';


function Login() {
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem(AppConst.storageKeys.accessToken);
    if (accessToken) {
      navigate("/product/showProducts");
    }
  }, [navigate]);
  
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { data } = await axiosInstance.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          "Authorization": `Bearer ${tokenResponse.access_token}`
        }
      });

      const response: AxiosResponse = await axiosInstance.post(`api/v1/auth/GoogleAuth`, {
        email: data.email,
        name: data.name
      });
      if (response.data.accessToken) {
        localStorage.setItem(AppConst.storageKeys.accessToken, response.data.accessToken);
        localStorage.setItem(AppConst.storageKeys.refreshToken, response.data.refreshToken);
        setTimeout(() => {
          if(location.state?.path){
            navigate(location.state.path);
            return;
          }
          navigate("/product/showProducts");
        }, 10);
      }
    }
  });

  const loginForm = useFormik<ILogInForm>({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be valid email").required("Please fill Email field"),
      password: Yup.string().max(15, "Password must be less than 15 characters").min(8, "Password must be more than 8 characters long").required("Please fill Password field"),
    }),
    onSubmit: async (values: ILogInForm) => {
      const { data } = await axiosInstance.post(`api/v1/auth/Login`, {
        email: values.email,
        password: values.password
      });
      if (data.accessToken) {
        localStorage.setItem(AppConst.storageKeys.accessToken, data.accessToken);
        localStorage.setItem(AppConst.storageKeys.refreshToken, data.refreshToken);
        setTimeout(() => {
          if(location.state?.path){
            navigate(location.state.path);
            return;
          }
          navigate("/product/showProducts");
        }, 10)
      }
    }
  });

  const forgotPasswordForm = useFormik<IForgotPasswordForm>({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be valid email").required("Please fill Email field"),
    }),
    onSubmit: async (values: IForgotPasswordForm) => {
     const {data} = await checkUser(values.email);
     if(!data.password){
      showNotificationMsg('You have signup using google oAuth. Cannot reset your password.', notificationType.WARNING);
      return;
     }
     navigate('/auth/get-otp', { state: {email: values.email, type: EmailTypes.FORGET_PASSWORD} });
  }});

  return (
    <Box sx={{ display: "flex", alignContent: "center", width: "100vw", height: "100vh" }} className="mixBackground">

      {!isForgotPassword && <form style={{ width: "100%" }} className="centreFlex my-4" onSubmit={loginForm.handleSubmit}>
        <Paper elevation={5} sx={{ width: { xs: "90%", md: "60%", lg: "40%" } }}>

          <Stack className='p-2' spacing={2}>

            <Typography className="section-head selfCenter" variant="overline" fontSize="large">
              LogIn
            </Typography>

            <TextField
              color="secondary"
              error={(loginForm.touched.email && loginForm.errors.email && true) || false}
              label="Email"
              helperText={loginForm.errors.email}
              onBlur={loginForm.handleBlur}
              onChange={loginForm.handleChange}
              name="email"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              color="secondary"
              error={(loginForm.touched.password && loginForm.errors.password && true) || false}
              label="Password"
              helperText={loginForm.errors.password}
              onBlur={loginForm.handleBlur}
              onChange={loginForm.handleChange}
              name="password"
              type="password"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button disabled={!(loginForm.dirty && loginForm.isValid)} type="submit" fullWidth variant="contained" endIcon={<LoginIcon />}>Login</Button>

            <Button color="secondary" fullWidth onClick={() => login()} startIcon={<GoogleIcon />} variant="contained">
              Log in with Google
            </Button>

            <Stack spacing={2}>

              <Stack className='fCenter' direction="row" spacing={2} >
                <Typography component="span" variant="subtitle2">Dont have a account?</Typography>
                <Link className='link' to="/auth/signup">
                  Signup
                </Link>
              </Stack>

              <Stack className='fCenter' direction="row" spacing={2} >
                <Typography component="span" variant="subtitle2">Continue shopping</Typography>
                <Link className='link' to="/product/showProducts">
                  Shopping
                </Link>
              </Stack>
              <Button variant='text' onClick={() => setIsForgotPassword(true)} color="secondary">Forgot Password</Button>


            </Stack>

          </Stack>
        </Paper>
      </form>}

      {isForgotPassword && <form style={{ width: "100%" }} className="centreFlex my-4" onSubmit={forgotPasswordForm.handleSubmit}>
        <Paper elevation={5} sx={{ width: { xs: "90%", md: "60%", lg: "40%" } }}>

          <Stack className='p-2' spacing={2}>

            <Typography className="section-head selfCenter" variant="overline" fontSize="large">
              Forgot Password
            </Typography>

            <TextField
              color="secondary"
              error={(forgotPasswordForm.touched.email && forgotPasswordForm.errors.email && true) || false}
              label="Email"
              helperText={forgotPasswordForm.errors.email}
              onBlur={forgotPasswordForm.handleBlur}
              onChange={forgotPasswordForm.handleChange}
              name="email"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button disabled={!(forgotPasswordForm.dirty && forgotPasswordForm.isValid)} type="submit" fullWidth variant="contained" endIcon={<LoginIcon />}>Get Otp</Button>
            <Stack spacing={2}>

              <Stack className='fCenter' direction="row" spacing={2} >
                <Typography component="span" variant="subtitle2">Remember Password?</Typography>
                <Button color="secondary" variant='text' onClick={() => { setIsForgotPassword(false) }}>LogIn</Button>
              </Stack>
            </Stack>

          </Stack>
        </Paper>
      </form>}
    </Box>
  )
}

export default Login;