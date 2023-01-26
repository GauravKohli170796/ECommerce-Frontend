import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import wishlistImage from "../../assets/images/wishList.png";


interface IProp {
    listName: string
}

function EmptyList(prop: IProp) {
    const navigate=  useNavigate();
    return (
        <>
        <Box className="fCol fCenter my-4 mx-2 py-4 mixBackground">
            <img src={wishlistImage} style={{ maxWidth: "96%" }} alt="Empty Wishlist"></img>
            <Typography variant='body1' sx={{ color: "white", fontSize: "25px", marginY: "8px" }}>{`Your ${prop.listName} is Empty`}</Typography>
            <Typography variant="body1" sx={{ color: "white", fontSize: "25px", marginY: "16px" }}>{`Add items to your ${prop.listName}`}</Typography>
            <Button variant="contained" color="secondary" size='large' onClick={() => navigate("/product/showProducts")} startIcon={<ShoppingBagIcon />}>Continue Shopping</Button>

        </Box>
        </>
    )
}
export default EmptyList;