import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import ManageOrders from '../order/ManageOrders';
import AddCategory from '../product/AddCategory';
import AddProduct from '../product/AddProduct';
import DeleteProduct from '../product/DeleteProduct';
import UpdateProduct from '../product/UpdateProduct';

function AdminController() {
    return (
        <>
        <Header/>
        <Box className="fCenter fCol my-2 mx-2">
            <Typography variant='h6' className="section-head my-2 font-20">
                Manage Product
            </Typography>

            <Accordion className='my-2' sx={{width:{xs:"100%",md:"60%"}}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h6">Add Product </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddProduct/>
                </AccordionDetails>
            </Accordion>
            <Accordion className='my-2' sx={{width:{xs:"100%",md:"60%"}}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography variant="h6">Update Product</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <UpdateProduct/>
                </AccordionDetails>
            </Accordion>
            <Accordion className='my-2' sx={{width:{xs:"100%",md:"60%"}}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography variant="h6">Delete Product</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteProduct/>
                </AccordionDetails>
            </Accordion>
            <Divider/>
            <Typography className="section-head my-2" sx={{fontSize:"20px"}}>
                Manage Categories
            </Typography>
            <Accordion className='my-2' sx={{width:{xs:"100%",md:"60%"}}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h6">Add Category</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddCategory/>
                </AccordionDetails>
            </Accordion>
            <Typography variant='h6' className="section-head my-2 font-20">
                Manage Orders 
            </Typography>
            <Accordion className='my-2' sx={{width:{xs:"100%",md:"60%"}}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h6">See Orders By Status </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ManageOrders/>
                </AccordionDetails>
            </Accordion>
        </Box>
        <Footer/>
        </>
    )
}

export default AdminController;