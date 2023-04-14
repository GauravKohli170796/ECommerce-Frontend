import { Box, Button, OutlinedInput, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppConst, notificationType } from '../../constants/AppConst';
import { EmailTypes } from '../../models/commanModel';
import { axiosInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';
import { sendEmail } from '../../services/emailService';
const initialOtp = ["", "", "", ""];

function Otp() {
    const [otp, setOtp] = useState(initialOtp);
    const [formedOtp, setFormedOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        SendOtp();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formedOtp]);

    useEffect(() => {
        if (!location.state?.email && location.state?.type) {
            navigate("/auth/login");
            return;
        }
        generateOtp();
        document.getElementById("first")?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.email])


    const SendOtp = async () => {
        if (formedOtp === "") {
            return;
        }
        const { data } = await sendEmail({ ...location.state, otp: formedOtp });
        if (!data) {
            showNotificationMsg(`Failed to send otp`, notificationType.DANGER);
            return;
        }
        showNotificationMsg(`Otp send successfully`, notificationType.INFO);
    }

    const resendPassword = async () => {
        await SendOtp();
    };

    const generateOtp = () => {
        let Otp = '';
        for (let i = 0; i < 4; i++) {
            Otp += Math.floor(Math.random() * 10);
        }
        setFormedOtp(Otp);
    }

    const handleOTP = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nextEle: string | null, index: number) => {
        const value = (event.target as HTMLInputElement)?.value;
        const tmpOtp = [...otp];
        tmpOtp[index] = value;
        setOtp(tmpOtp);
        if (nextEle && value) {

            document.getElementById(nextEle)?.focus();
        }
    };

    const handleSignUp = async() => {
        const signUpDetails = sessionStorage.getItem("signupDetails");
        if(!signUpDetails){
            showNotificationMsg("Something went wrong. Could not complete your SignUp request.", notificationType.DANGER);
            return;
        }
        const { data } = await axiosInstance.post(`api/v1/auth/Signup`, JSON.parse(signUpDetails));
        sessionStorage.clear();
        if (data.accessToken) {
            localStorage.setItem(AppConst.storageKeys.accessToken, data.accessToken);
            localStorage.setItem(AppConst.storageKeys.refreshToken, data.refreshToken);
            setTimeout(() => {
                navigate("/product/showProducts");
            }, 10)
        }
    }

    const handleOtpSubmit = async () => {
        const enteredOtp = otp.toString().replace(/,/g, "");
        if (enteredOtp !== formedOtp) {
            showNotificationMsg(`Entered Otp is incorrect`, notificationType.WARNING);
            return;
        }
        if (location.state?.type === EmailTypes.FORGET_PASSWORD) {
            navigate('/auth/change-password', { state: { email: location.state.email } });
            return;
        }
        await handleSignUp();
    };

    const clearOTP = () => {
        setOtp(initialOtp)
    };

    return (
        <Box sx={{ display: "flex", alignContent: "center", width: "100vw", height: "100vh" }} className="mixBackground">

            <form style={{ width: "100%" }} className="centreFlex my-4">
                <Paper elevation={5} sx={{ width: { xs: "90%", md: "60%", lg: "40%" } }}>

                    <Stack className='p-2' spacing={3}>

                        <Typography className="section-head selfCenter" variant="overline" fontSize="large" sx={{ marginBottom: "32px" }}>
                            Enter OTP
                        </Typography>

                        <Stack direction="row" spacing={1} className='fRow fCenter'>

                            <OutlinedInput
                                color="secondary"
                                name="password"
                                type="text"
                                className='otpInput'
                                id='first'
                                onChange={(e) => { handleOTP(e, 'sec', 0) }}
                                inputProps={{ maxLength: 1 }}
                                value={otp[0]}
                            />
                            <Typography variant='h4'>-</Typography>
                            <OutlinedInput
                                color="secondary"
                                name="password"
                                type="text"
                                className='otpInput'
                                id='sec'
                                onChange={(e) => { handleOTP(e, 'third', 1) }}
                                inputProps={{ maxLength: 1 }}
                                value={otp[1]}
                            />
                            <Typography variant='h4'>-</Typography>
                            <OutlinedInput
                                color="secondary"
                                name="password"
                                type="text"
                                className='otpInput'
                                id='third'
                                onChange={(e) => { handleOTP(e, 'fourth', 2) }}
                                inputProps={{ maxLength: 1 }}
                                value={otp[2]}
                            />
                            <Typography variant='h4'>-</Typography>
                            <OutlinedInput
                                color="secondary"
                                name="password"
                                type="text"
                                sx={{ textAlign: "center" }}
                                className='otpInput'
                                id='fourth'
                                onChange={(e) => { handleOTP(e, null, 3) }}
                                inputProps={{ maxLength: 1 }}
                                value={otp[3]}
                            />
                        </Stack>
                        <Stack direction="row" className="fRow fRight">
                            <Button size='small' color="secondary" variant="outlined" onClick={clearOTP}>Clear</Button>
                            <Button size='small' color="secondary" onClick={resendPassword} variant="outlined">Resend</Button>
                        </Stack>
                        <Button variant='contained' color="secondary" className='my-2' onClick={handleOtpSubmit} disabled={otp.toString().replace(/,/g, "").length !== 4}>Submit</Button>
                    </Stack>
                </Paper>
            </form>
        </Box>
    )
}
export default Otp;