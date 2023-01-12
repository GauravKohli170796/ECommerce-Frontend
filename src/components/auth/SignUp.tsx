import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useGoogleLogin } from '@react-oauth/google';
import { AxiosResponse } from 'axios';
import { useFormik } from "formik";
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { axiosInstance } from '../../services/axiosInstance';


interface ISignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: number | string;

}

function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("auth");
    if (authToken) {
      navigate("/product/showProducts");
    }
  }, [navigate]);

  const signup = useGoogleLogin({
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
        setTimeout(()=>{
          navigate("/product/showProducts");
        },10)
      }
    }
  });

  const signUpForm = useFormik<ISignUpForm>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email must be valid email").required("Please fill Email field"),
      password: Yup.string().max(15, "Password must be less than 15 characters").min(8, "Password must be more than 8 characters long").required("Please fill Password field"),
      name: Yup.string().max(15, "Name must be less than 15 characters").required("Please fill Name field"),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Passwords don't match!").required(),
      phoneNumber: Yup.string().min(10, "Phone Number must be 10 digits").max(10, "Phone Number must be 10 digits").required("Please fill Phone Number field")
    }),
    onSubmit: async (values: ISignUpForm) => {
      const { data } = await axiosInstance.post(`api/v1/auth/Signup`, {
        email: values.email,
        password: values.password,
        name: values.name,
        phoneNumber: values.phoneNumber

      });
      if (data.token) {
        localStorage.setItem("auth", data.token);
        setTimeout(()=>{
          navigate("/product/showProducts");
        },10)
      }
    }
  })
  return (
    <Box>
      <form style={{ width: "100%" }} className="centreFlex my-4" onSubmit={signUpForm.handleSubmit}>

        <Stack className='border' spacing={2} sx={{ width: { xs: "90%", md: "50%" } }}>

          <Typography className="section-head" variant="overline" fontSize="large">
            SignUp
          </Typography>

          <TextField
            color="secondary"
            error={(signUpForm.touched.email && signUpForm.errors.email && true) || false}
            label="Email"
            helperText={signUpForm.errors.email}
            onBlur={signUpForm.handleBlur}
            onChange={signUpForm.handleChange}
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
            error={(signUpForm.touched.name && signUpForm.errors.name && true) || false}
            label="Name"
            helperText={signUpForm.errors.name}
            onBlur={signUpForm.handleBlur}
            onChange={signUpForm.handleChange}
            name="name"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            color="secondary"
            error={(signUpForm.touched.password && signUpForm.errors.password && true) || false}
            label="Password"
            helperText={signUpForm.errors.password}
            onBlur={signUpForm.handleBlur}
            onChange={signUpForm.handleChange}
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

          <TextField
            color="secondary"
            error={(signUpForm.touched.confirmPassword && signUpForm.errors.confirmPassword && true) || false}
            label="Confirm Password"
            helperText={signUpForm.errors.confirmPassword}
            onBlur={signUpForm.handleBlur}
            onChange={signUpForm.handleChange}
            name="confirmPassword"
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

          <TextField
            color="secondary"
            error={(signUpForm.touched.phoneNumber && signUpForm.errors.phoneNumber && true) || false}
            label="Phone Number"
            type="number"
            helperText={signUpForm.errors.phoneNumber}
            onBlur={signUpForm.handleBlur}
            onChange={signUpForm.handleChange}
            name="phoneNumber"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button disabled={!(signUpForm.dirty && signUpForm.isValid)} type="submit" fullWidth variant="contained">SignUp</Button>

          <Button fullWidth onClick={() => signup()} startIcon={<GoogleIcon />} variant="contained">
            Sign up with Google
          </Button>

          <Stack className='fCenter' direction="row" spacing={2} >
            <Typography component="span" variant="subtitle2">Already have a account?</Typography>
            <Link to="/auth/login">
              LogIn
            </Link>
          </Stack>

        </Stack>
      </form>
    </Box>
  )
}

export default SignUp;