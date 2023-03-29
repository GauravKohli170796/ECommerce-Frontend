import PaymentIcon from '@mui/icons-material/Payment';
import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Paper, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import axios from "axios";
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { AppConst, notificationType } from '../../constants/AppConst';
import { IAddressInfo } from '../../models/addressModel';
import { IAddOrderRequest, ORDER_STATUS } from '../../models/orderModels';
import { ICartProduct } from '../../models/productModel';
import { addUserAddress, fetchUserAddress, updateUserAddress } from '../../services/addressService';
import { showNotificationMsg } from '../../services/createNotification';
import { addOrder } from '../../services/orderService';
import Footer from '../footer/Footer';
import Header from '../header/Header';

interface IAddressForm {
    _id?: string;
    addressLine1: string;
    addressLine2: string;
    pinCode: string;
    city: string;
    country: string;
    state: string;
    phoneNumber: string
}

const initialAddress = {
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    city: "",
    country: "",
    state: "",
    phoneNumber: ""

};

function Checkout() {

    const navigate = useNavigate();
    const [userAddress, setUserAddress] = useState<IAddressInfo[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<IAddressInfo>(initialAddress);
    useEffect(() => {
        const fetchAddressDetails = async () => {
            const { data } = await fetchUserAddress();
            const addressArr = [];
            for (let address of data) {
                addressArr.push({ ...address, label: `${address.addressLine1} , ${address.addressLine2} , Pincode - ${address.pinCode}` });
            }
            setUserAddress(addressArr);
        };
        const authDetails = localStorage.getItem("auth");
        const orderDetails = sessionStorage.getItem(AppConst.checkoutKey);
        if (!(authDetails && orderDetails)) {
            navigate("/product/showProducts");
        }
        fetchAddressDetails();
        return () => {
            sessionStorage.clear();
        }
    }, [navigate]);

    const AppState = GetAppState();
    const adressForm = useFormik<IAddressForm>({
        enableReinitialize: true,
        initialValues: selectedAddress,
        validationSchema: Yup.object({
            addressLine1: Yup.string().required("Please fill Adress line 1 field"),
            addressLine2: Yup.string().required("Please fill Adress line 2 field"),
            pinCode: Yup.string().required("Please fill Pincode Code field"),
            city: Yup.string().required("Please fill City field"),
            state: Yup.string().required("Please fill State field"),
            country: Yup.string().required("Please fill Country field"),
            phoneNumber: Yup.string().min(10, "Phone Number must be 10 digits").max(10, "Phone Number must be 10 digits").required("Please fill Phone Number field")
        }),
        onSubmit: async (values: IAddressForm) => {
            if (!values._id) {
                const newAddress = await addUserAddress(values);
                values._id = newAddress.data._id;
                handleOrderDetail(values);
                return;
            }
            await updateUserAddress(values._id, values);
            handleOrderDetail(values);
        }
    });

    const showOrderMessage = (orderId: string) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Paper elevation={10}>
                        <Box className="fCol fCenter my-2" sx={{ padding: "32px" }}>
                            <Typography variant='body2'> {`Your order id is ${orderId}`}</Typography>
                            <Typography variant="body2">Your request is send to product owner via email.Please check your email for order details.Product owners will contact you soon on your provided contact details.Please follow emails for further communication.</Typography>
                            <Stack direction="row" spacing={2}>
                                <Button size="small" onClick={() => {
                                    onClose();
                                    navigate("/product/showProducts")
                                }} color="primary" variant="contained">Got it</Button>
                            </Stack>
                        </Box>
                    </Paper>
                );
            }
        });
    };

    const handleOrderDetail = async (addressDetails: IAddressForm) => {
        const checkoutDetails = sessionStorage.getItem(AppConst.checkoutKey);
        if (!addressDetails._id || !checkoutDetails) {
            showNotificationMsg("Something went wrong.Please try again",notificationType.WARNING);
            return;
        };
        let orderDetails: IAddOrderRequest = {
            addressId: addressDetails._id,
            productIds: [],
            productDetails: [],
            orderStatus: ORDER_STATUS.NotAccepted
        };
        const checkoutDetailsJson: ICartProduct[] = JSON.parse(checkoutDetails);
        for (let item of checkoutDetailsJson) {
            orderDetails.productIds.push(item.productId._id);
            orderDetails.productDetails.push({
                productId: item.productId._id,
                quantity: parseInt(item.quantity.toString()),
                price: item.productId.price,
                color: item.color,
                size: item.size
            })
        }
        const {data} = await addOrder(orderDetails);
        AppState.setCartList([]);
        showOrderMessage(data._id);

    };

    const handleAddressSelection = (addressInfo: IAddressInfo | null) => {
        if (addressInfo) {
            setSelectedAddress(addressInfo);
        }
    }

    const fetchLocationInfo = (pincode: string) => {
        if (!adressForm.values._id) {
            AppState.setLoading(true);
            axios.get(`https://api.postalpincode.in/pincode/${pincode}`).then(function (response) {
                AppState.setLoading(false);
                const locationData = response.data?.[0]?.PostOffice[0];
                if (locationData) {
                    adressForm.values.country = locationData.Country;
                    adressForm.values.state = locationData.State;
                    adressForm.values.city = locationData.District;

                }
            }).catch(function (error) {
                AppState.setLoading(false);
            });
        }
    }


    return (
        <>
            <Header />
            <form onSubmit={adressForm.handleSubmit}>
                <Box className='fCenter fCol my-4'>
                    <Stack spacing={2} sx={{ width: { xs: "90%", md: "70%" } }}>
                        <Autocomplete
                            id="combo-box-demo"
                            options={userAddress}
                            autoComplete={false}
                            onChange={(_e, value: IAddressInfo | null) => { handleAddressSelection(value) }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Select from previous locations" />}
                        />
                        <Typography className="section-head selfCenter" variant="overline" fontSize="large">
                            Add New Address
                        </Typography>
                        <TextField
                            label="Address Line 1"
                            variant="outlined"
                            color="secondary"
                            error={(adressForm.touched.addressLine1 && adressForm.errors.addressLine1 && true) || false}
                            onBlur={adressForm.handleBlur}
                            onChange={adressForm.handleChange}
                            name="addressLine1"
                            fullWidth
                            value={adressForm.values.addressLine1}
                            helperText={adressForm.errors.addressLine1}
                        />
                        <TextField
                            label="Address Line 2"
                            variant="outlined"
                            color="secondary"
                            error={(adressForm.touched.addressLine2 && adressForm.errors.addressLine2 && true) || false}
                            onBlur={adressForm.handleBlur}
                            onChange={adressForm.handleChange}
                            name="addressLine2"
                            fullWidth
                            value={adressForm.values.addressLine2}
                            helperText={adressForm.errors.addressLine2}
                        />
                        <TextField
                            label="Postal Code"
                            variant="outlined"
                            color="secondary"
                            error={(adressForm.touched.pinCode && adressForm.errors.pinCode && true) || false}
                            onBlur={(e) => {
                                adressForm.handleBlur(e);
                                fetchLocationInfo(e.target.value)
                            }
                            }
                            autoComplete='new-password'
                            onChange={adressForm.handleChange}
                            name="pinCode"
                            fullWidth
                            type="number"
                            value={adressForm.values.pinCode}
                            helperText={adressForm.errors.pinCode}
                        />
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            color="secondary"
                            error={(adressForm.touched.phoneNumber && adressForm.errors.phoneNumber && true) || false}
                            onBlur={adressForm.handleBlur}
                            onChange={adressForm.handleChange}
                            name="phoneNumber"
                            type="number"
                            fullWidth
                            value={adressForm.values.phoneNumber}
                            helperText={adressForm.errors.phoneNumber}
                        />
                        <TextField
                            label="City"
                            variant="outlined"
                            color="secondary"
                            error={(adressForm.touched.city && adressForm.errors.city && true) || false}
                            onBlur={adressForm.handleBlur}
                            onChange={adressForm.handleChange}
                            name="city"
                            value={adressForm.values.city}
                            fullWidth
                            helperText={adressForm.errors.city}
                        />
                        <TextField
                            label="State/Province/Region"
                            name="state"
                            variant="outlined"
                            color="secondary"
                            value={adressForm.values.state}
                            error={(adressForm.touched.state && adressForm.errors.state && true) || false}
                            onBlur={adressForm.handleBlur}
                            onChange={adressForm.handleChange}
                            helperText={adressForm.errors.state}
                            fullWidth
                        />
                        <TextField
                            label="Country"
                            name="country"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            value={adressForm.values.country}
                            error={(adressForm.touched.country && adressForm.errors.country && true) || false}
                            onBlur={adressForm.handleBlur}
                            onChange={adressForm.handleChange}
                            helperText={adressForm.errors.country}
                            autoComplete='new-password'
                        />
                        <Typography className="section-head selfCenter" variant="overline" fontSize="large">
                            Payment Method
                        </Typography>
                        <Paper elevation={5} className="p-2 my-2 mx-2">
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Cash On Delivery"
                                checked={true}
                            />
                        </Paper>
                        <Button sx={{ alignSelf: "flex-end", width: "fit-content" }} startIcon={<PaymentIcon />} type="submit" variant="contained" color="secondary" disabled={!(adressForm.isValid)}>Confirm Order</Button>
                    </Stack>
                </Box>
            </form>
            <Footer />
        </>
    )
}

export default Checkout;