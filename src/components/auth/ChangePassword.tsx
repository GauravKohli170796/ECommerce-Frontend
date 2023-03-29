import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import { Button, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { notificationType } from '../../constants/AppConst';
import { changePassword } from '../../services/authService';
import { showNotificationMsg } from '../../services/createNotification';


interface IChangePaswwordForm {
  password: string;
  cnfPassowrd: string;
}

function ChangePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!location.state?.email){
      navigate("/auth/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location])

  const changePaswwordForm = useFormik<IChangePaswwordForm>({
    initialValues: {
      password: "",
      cnfPassowrd: ""
    },
    validationSchema: Yup.object({
      password: Yup.string().max(15, "Password must be less than 15 characters").min(8, "Password must be more than 8 characters long").required("Please fill Password field"),
      cnfPassowrd: Yup.string().oneOf([Yup.ref('password')], "Passwords don't match!").required("Please fill Confirm Password")
    }),
    onSubmit: async (values: IChangePaswwordForm) => {
       const {data} = await changePassword({email:location.state.email,password:values.password});
       if(!data){
        showNotificationMsg("Failed to change Password",notificationType.WARNING);
        return;
       }
       showNotificationMsg("Password successfully reset.", notificationType.INFO);
       navigate("/auth/login");
    }
  });

  return (
    <Box sx={{ display: "flex", alignContent: "center", width: "100vw", height: "100vh" }} className="mixBackground">

      <form style={{ width: "100%" }} className="centreFlex my-4" onSubmit={changePaswwordForm.handleSubmit}>
        <Paper elevation={5} sx={{ width: { xs: "90%", md: "60%", lg: "40%" } }}>

          <Stack className='p-2' spacing={2}>

            <Typography className="section-head selfCenter" variant="overline" fontSize="large">
              Change Password
            </Typography>

            <TextField
              color="secondary"
              label="Email"
              value={location.state?.email}
              disabled
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
              error={(changePaswwordForm.touched.password && changePaswwordForm.errors.password && true) || false}
              label="New Password"
              helperText={changePaswwordForm.errors.password}
              onBlur={changePaswwordForm.handleBlur}
              onChange={changePaswwordForm.handleChange}
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
              error={(changePaswwordForm.touched.cnfPassowrd && changePaswwordForm.errors.cnfPassowrd && true) || false}
              label="Confirm Password"
              helperText={changePaswwordForm.errors.cnfPassowrd}
              onBlur={changePaswwordForm.handleBlur}
              onChange={changePaswwordForm.handleChange}
              name="cnfPassowrd"
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

            <Button disabled={!(changePaswwordForm.dirty && changePaswwordForm.isValid)} type="submit" fullWidth variant="contained" endIcon={<LoginIcon />}>Change Password</Button>
          </Stack>
        </Paper>
      </form>
    </Box>
  )
}

export default ChangePassword;