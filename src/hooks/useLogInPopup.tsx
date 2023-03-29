import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';

function useLogInPopup() {
    const navigate = useNavigate();
    const showAlertMessage = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Paper elevation={10}>
                        <Box className="fCol fCenter my-2" sx={{ padding: "32px" }}>
                            <Typography variant="caption">Facilities like Cart and Wishlist are available only after logIn. Please Login First. </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button size="small" color="secondary" onClick={() => {
                                    onClose();
                                    navigate("/auth/login",{state:{path:window.location.pathname}})
                                }} variant="contained">Log In</Button>
                                <Button size="small" color="secondary" onClick={() => {
                                    onClose();
                                }} variant="outlined">Close</Button>
                            </Stack>
                        </Box>
                    </Paper>
                );
            }
        });
    };

    return showAlertMessage;
}

export default useLogInPopup