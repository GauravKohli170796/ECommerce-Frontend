import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import KeyIcon from '@mui/icons-material/Key';
import { Button, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useGoogleLogin } from '@react-oauth/google';
import { AxiosResponse } from 'axios';
import { useFormik } from "formik";
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { axiosInstance } from '../../services/axiosInstance';

interface ILogInForm {
  email: string;
  password: string;
}
function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("auth");
    if (authToken) {
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
        password: data.name
      });
      if (response.data.token) {
        localStorage.setItem("auth", response.data.token);
        setTimeout(() => {
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
      if (data.token) {
        localStorage.setItem("auth", data.token);
        setTimeout(() => {
          navigate("/product/showProducts");
        }, 10)
      }
    }
  });

  return (
    <Box>

      <form style={{ width: "100%" }} className="centreFlex my-4" onSubmit={loginForm.handleSubmit}>
        <Paper elevation={5} sx={{ width: { xs: "90%", md: "60%", lg: "40%" } }}>

          <Stack className='p-2' spacing={2}>

            <Typography className="section-head" variant="overline" fontSize="large">
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

            <Button disabled={!(loginForm.dirty && loginForm.isValid)} type="submit" fullWidth variant="contained">Login</Button>

            <Button color="secondary" fullWidth onClick={() => login()} startIcon={<GoogleIcon />} variant="contained">
              Log in with Google
            </Button>

            <Stack spacing={2}>

              <Stack className='fCenter' direction="row" spacing={2} >
                <Typography component="span" variant="subtitle2">Already have a account?</Typography>
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
            </Stack>

          </Stack>
        </Paper>
      </form>
    </Box>
  )
}

export default Login;