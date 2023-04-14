import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardMedia, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppConst, notificationType, productHeadingType } from '../../constants/AppConst';
import useCartWishListFetch from '../../hooks/useCartWishListFetch';
import { IOrderDetails } from '../../models/orderModels';
import { showNotificationMsg } from '../../services/createNotification';
import { getUserOrders } from '../../services/orderService';
import EmptyList from '../cart/EmptyList';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import ProdHeader from '../header/ProdHeader';
import ProductScroll from '../product/ProductScroll';


function Orders() {
    const [userOrders,setUserOrders]=useState<IOrderDetails[]>([]);
    const fetchCartProducts = useCartWishListFetch();
    const navigate = useNavigate();
    useEffect(()=>{
            const tokenDetails = localStorage.getItem(AppConst.storageKeys.accessToken);
            if (!tokenDetails) {
              showNotificationMsg("You need to login first.", notificationType.WARNING);
              navigate("/auth/login");
              return;
            }
        const getUserAllOrders= async()=>{
           const {data} = await getUserOrders();
           setUserOrders(data);
        }
        fetchCartProducts();
        getUserAllOrders();
    },[]);

    const renderOrders = () => {
        return <>
            <Typography className="section-head my-4" sx={{ fontSize: "25px", marginLeft: "auto", marginRight: "auto" }}>
                My Orders
            </Typography>
            <Divider sx={{ marginY: "16px", width: "96vw" }} />
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                {userOrders?.map((orderGroup, indexOuter) => {
                    return orderGroup.productIds.map((order, indexInner) => {
                        return <Card key={order._id} sx={{ display: 'flex', marginY: "32px", marginX: "8px", padding: "16px" }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 150, objectFit: "cover", height: 150 }}
                                image={order.images[0]}
                                alt="Ordered product image"
                            />
                            <Box>
                                <CardContent sx={{ width: "50vw" }}>
                                    <Typography gutterBottom variant="body1" component="div" sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}>
                                        {order.name}
                                    </Typography>

                                    <Typography
                                        sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {order.description}
                                    </Typography>

                                    <Accordion className='my-2'>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Order Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{textOverflow:"ellipsis",overflow:"hidden"}}>
                                            <Typography>Product Details</Typography>
                                            <Stack>
                                                <Typography variant="subtitle2">{`Size : ${orderGroup.productDetails[indexInner].size},`}</Typography>
                                                <Typography variant='subtitle2'>{`Color : ${orderGroup.productDetails[indexInner].color},`} </Typography>
                                                <Typography variant='subtitle2'>{`Quantity : ${orderGroup.productDetails[indexInner].quantity},`} </Typography>
                                                <Typography variant='subtitle2'>{`Price : ${orderGroup.productDetails[indexInner].quantity}x${orderGroup.productDetails[indexInner].price}=${orderGroup.productDetails[indexInner].price * orderGroup.productDetails[indexInner].quantity}rs`}</Typography>
                                                <Typography variant='subtitle2'>{`Status : ${orderGroup.orderStatus}`}</Typography>
                                            </Stack>
                                            <Divider sx={{marginY:"16px"}} />
                                            <Typography>Address Details</Typography>
                                            <Stack>
                                                <Typography variant='subtitle2'>{`${orderGroup.addressId.addressLine1},`}</Typography>
                                                <Typography variant='subtitle2'>{`${orderGroup.addressId.addressLine2},`}</Typography>
                                                <Typography variant='subtitle2'>{`${orderGroup.addressId.city},`}</Typography>
                                                <Typography variant='subtitle2'>{`${orderGroup.addressId.state},`}</Typography>
                                                <Typography variant='subtitle2'>{orderGroup.addressId.pinCode}</Typography>
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>

                                </CardContent>
                            </Box>
                        </Card>
                    })
                })
                }
            </Box>
        </>
    }

    const renderEmptyOrderList = () => {
        return <EmptyList listName='Order List' />
      };
    return (
        <>
            <Header />
            {userOrders.length>0 && renderOrders()}
            {userOrders.length===0 && renderEmptyOrderList()}
            <Divider sx={{ marginY: "16px", width: "96vw" }} />
            <ProdHeader />
            <ProductScroll name={productHeadingType.RECOMMENDED} />
            <Footer />

        </>
    )
}

export default Orders