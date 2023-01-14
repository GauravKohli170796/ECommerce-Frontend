import { Avatar, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';

function Footer() {
    return (
        <Box className="fCenter fCol mixBackground p-2 my-2" sx={{ color: "white" }}>
            {/* <div className="grid-container">
                    <div className="grid-ele" style={{ gridRow: "1/2" }}>DEVELOPED BY,</div>
                    <div className="grid-ele" style={{ gridRow: "2/3" }}>Gaurav Kohli (NIT Kurukshetra | Software Developer at Pine Labs)
                    </div>
                    <div className="grid-ele" style={{ gridRow: "3/4" }}>© COPYRIGHT</div>
                    <div className="grid-ele" style={{ gridRow: "4/5" }}>All Rights Reserved</div>

                </div> */}

                <Avatar
                    alt="Gaurav Kohli"
                    src="https://res.cloudinary.com/dnqwvvtqf/image/upload/v1673704357/ProductTest/pf51bw72wjas9nfh46vx.webp"
                    sx={{ width: 100, height: 100}}
                />
            <Stack direction="column" spacing={3}>
                <Typography sx={{ textAlign: "center" }}>DEVELOPED BY,</Typography>
                <Typography sx={{ textAlign: "center" }}>Gaurav Kohli (NIT Kurukshetra | X Software Developer at Pine Labs | Senior Software Enginner at Tech Prescient)</Typography>
                <Typography sx={{ textAlign: "center" }}>© COPYRIGHT</Typography>
                <Typography sx={{ textAlign: "center" }}>All Rights Reserved</Typography>

            </Stack>
        </Box>
    )
}
export default Footer;