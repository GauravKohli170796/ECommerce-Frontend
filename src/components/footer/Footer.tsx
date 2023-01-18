import { Avatar, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';


function Footer() {
    return (
        <Box className="fCenter fCol mixBackground p-2 my-2" sx={{ color: "white" }}>
            <Avatar
                alt="Gaurav Kohli"
                src="https://res.cloudinary.com/dnqwvvtqf/image/upload/v1673704357/ProductTest/pf51bw72wjas9nfh46vx.webp"
                sx={{ width: 100, height: 100 }}
            />
            <Stack direction="column" spacing={3}>
                <Typography sx={{ textAlign: "center" }}>DEVELOPED BY,</Typography>
                <Typography sx={{ textAlign: "center" }}>Gaurav Kohli (NIT Kurukshetra | X Software Engineer at Pine Labs | Senior Software Engineer at Tech Prescient)</Typography>
                <Typography sx={{ textAlign: "center" }}>© COPYRIGHT</Typography>
                <Typography sx={{ textAlign: "center" }}>All Rights Reserved</Typography>

            </Stack>
        </Box>
    )
}
export default Footer;