import { Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Tab, Tabs, Typography } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderStatusOptions, ordersPerPage } from '../../constants/AppConst';
import { IOrderByStatus, ORDER_STATUS } from '../../models/orderModels';
import { showNotificationMsg } from '../../services/createNotification';
import { getOrderByStatus, updateOrderStatus } from '../../services/orderService';

function ManageOrders() {
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [isEditOrderView, setIsEditOrderView] = useState<boolean>(false);
    const [orders, setOrders] = useState<IOrderByStatus | null>(null);
    const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
    const [editOrderStatus, setEditOrderStatus] = React.useState<ORDER_STATUS>(ORDER_STATUS.NotAccepted);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: ordersPerPage,
        page: 0,
    });

    useEffect(() => {
        if (orderStatus) {
            getOrderByStatus(paginationModel.page.toString(), orderStatus || "").then((res) => {
                setOrders(res.data);
            });
        }

    }, [orderStatus, paginationModel.page])

    const handleOrderStatusChange = async (event: React.SyntheticEvent, orderStatus: string) => {
        setOrderStatus(orderStatus);
        setPaginationModel({ ...paginationModel, page: 0 });
        setSelectionModel([]);
    };
    const handlePageChange = (model: GridPaginationModel, details: GridCallbackDetails) => {
        setPaginationModel({ ...paginationModel, page: model.page });
        setSelectionModel([]);
    }
    const handleSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
        if (rowSelectionModel.length > 1) {
            const selectionset = new Set(selectionModel);
            const result = rowSelectionModel.filter((s) => !selectionset.has(s));
            const editableOrder = orders?.orderDetails?.filter((order) => order._id === result[0])[0];
            setSelectionModel(result);
            setEditOrderStatus(editableOrder?.orderStatus || ORDER_STATUS.NotAccepted);
        } else {
            const editableOrder = orders?.orderDetails?.filter((order) => order._id === rowSelectionModel[0])[0];
            setSelectionModel(rowSelectionModel);
            setEditOrderStatus(editableOrder?.orderStatus || ORDER_STATUS.NotAccepted);
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Order Id',
            description: 'Order Id of this order.',
            width: 220,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row._id}`
        },
        {
            field: 'orderStatus',
            headerName: 'Order Status',
            description: 'Current status of this order',
            width: 180,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.orderStatus}`
        },
        {
            field: 'city',
            headerName: 'City',
            description: 'This City is the city where you need to deliver this order.',
            width: 150,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.addressDetails[0].city}`
        },
        {
            field: 'pincode',
            headerName: 'Pincode',
            description: 'This Pincode is the pincode where you need to deliver this order.',
            width: 90,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.addressDetails[0].pinCode}`
        },
        {
            field: 'totalOrderPrice',
            headerName: 'Order Price',
            description: 'This is total amount customer needs to pay for this order',
            sortable: false,
            width: 260,
            valueGetter: (params: GridValueGetterParams) => {
                let price = 0;
                let expression = '';
                for (const item of params.row.productDetails) {
                    expression += `${item.quantity} x ${item.price} + `
                    price += parseInt(item.price) * parseInt(item.quantity)
                }
                return `${expression.slice(0, expression.length - 2)} = ${price}`
            }
        },
        {
            field: 'createdAt',
            headerName: 'Order Date',
            description: 'Order Id of this order.',
            width: 100,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
                const date = new Date(params.row.createdAt);
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
                const day = String(date.getUTCDate()).padStart(2, '0');
                return `${day}-${month}-${year}`;
            }
        },
    ];

    const renderCategoryOptions = (currentOrderStatus: any) => {
        return Object.keys(orderStatusOptions).map((orderStatus: string) => {
          return <MenuItem selected={currentOrderStatus===orderStatus} value={orderStatus} key={orderStatus}>{orderStatus}</MenuItem>
        });
      }

    const handleOrderStatusSubmit = async(e:SyntheticEvent)=>{
        e.preventDefault();
        const {data} = await updateOrderStatus(selectionModel[0]?.toString(),{ orderStatus: editOrderStatus});
        if(data.orderStatus===editOrderStatus){
            showNotificationMsg("Order status successfully updated");
            setIsEditOrderView(false);
        };
       

    };  
     const renderEditOrderView = () => {
        const editableOrder = orders?.orderDetails?.filter((order) => order._id === selectionModel[0])[0];
        return <Box>
            <Button sx={{ marginY: "16px" }} onClick={() => { setIsEditOrderView(false) }} variant="outlined" color="secondary" size="small">Back</Button>
            <Alert sx={{ justifyContent: "center", marginY: "8px" }} severity="info">Click on Product ID to view product in new tab.</Alert>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Ordered Product Details</Typography>
            {editableOrder?.productDetails.map((orderedProduct, index) => <Stack key={orderedProduct.productId} sx={{ marginY: "8px" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{`Product ${index + 1}`}</Typography>
                <Link to={`/product/productDetail/${orderedProduct.productId}`} style={{ textDecoration: "none", fontSize: "small", marginBottom: "4px", marginTop: "4px" }} target="_blank" rel="noopener noreferrer">{`Product ID : ${orderedProduct.productId},`}</Link>
                <Typography variant="subtitle2">{`Size : ${orderedProduct.size},`}</Typography>
                <Typography variant='subtitle2'>{`Color : ${orderedProduct.color},`} </Typography>
                <Typography variant='subtitle2'>{`Quantity : ${orderedProduct.quantity},`} </Typography>
                <Typography variant='subtitle2'>{`Price : ${orderedProduct.quantity}x${orderedProduct.price}=${orderedProduct.price * orderedProduct.quantity}rs`}</Typography>
            </Stack>)}
            <Divider sx={{ marginY: "16px" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Delivery Address Details</Typography>
            <Stack>
                <Typography variant='subtitle2'>{`${editableOrder?.addressDetails[0]?.addressLine1},`}</Typography>
                <Typography variant='subtitle2'>{`${editableOrder?.addressDetails[0]?.addressLine2},`}</Typography>
                <Typography variant='subtitle2'>{`${editableOrder?.addressDetails[0]?.city},`}</Typography>
                <Typography variant='subtitle2'>{`${editableOrder?.addressDetails[0]?.state},`}</Typography>
                <Typography variant='subtitle2'>{`${editableOrder?.addressDetails[0]?.pinCode}`}</Typography>
            </Stack>
            <Divider sx={{ marginY: "16px" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Change Order Status</Typography>
            <form style={{ width: "100%" ,marginTop:"16px"}} onSubmit={handleOrderStatusSubmit}>
                <FormControl fullWidth>
                    <InputLabel color="secondary" size='small'>Order Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size='small'
                        color="secondary"
                        value={editOrderStatus}
                        name="orderStatus"
                        label="Order Status"
                        onChange={(e:any)=>{setEditOrderStatus(e.target?.value || "")}}
                    >
                        {renderCategoryOptions(editableOrder?.orderStatus)}
                    </Select>
                </FormControl>
                <Button sx={{float:"right",marginY:"16px"}} disabled={(editableOrder?.orderStatus === editOrderStatus)} type="submit" color="secondary" variant="contained" size="small">Update Status</Button>
            </form>
        </Box>
    };

    const renderOrdersByStatusData = () => {
        return <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                sx={{

                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                        display: "none"
                    }
                }}
                rows={orders?.orderDetails || []}
                localeText={{ noRowsLabel: `No Orders found with status '${orderStatus}'` }}
                rowSelectionModel={selectionModel}
                autoPageSize={true}
                autoHeight={true}
                disableColumnMenu={true}
                paginationModel={paginationModel}
                rowCount={orders?.totalOrders[0]?.totalOrders || 0}
                columns={columns}
                getRowId={(row) => row._id}
                paginationMode='server'
                checkboxSelection
                disableRowSelectionOnClick
                onPaginationModelChange={handlePageChange}
                onRowSelectionModelChange={handleSelectionModelChange}
            />
            {selectionModel.length === 1 && <Button onClick={() => { setIsEditOrderView(true) }} sx={{ marginY: "8px", float: "right" }} variant="outlined" color="secondary" size="small">Edit Order</Button>}
        </Box>
    }

    return (
        <>
            {!isEditOrderView && <> <Alert sx={{ justifyContent: "center" }} severity="info">Please select order status to view all orders with that status.You can also change status of orders by clicking on checkbox and then edit order button.</Alert>
                <Tabs
                    className='fRow fLeft'
                    variant="scrollable"
                    value={orderStatus}
                    onChange={handleOrderStatusChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    {Object.keys(orderStatusOptions).map((orderStatus: string) => <Tab key={orderStatus} value={orderStatus} label={orderStatus} />)}
                </Tabs>
                {Array.isArray(orders?.orderDetails) && renderOrdersByStatusData()}</>}
            {isEditOrderView && renderEditOrderView()}
        </>
    )
}

export default ManageOrders;