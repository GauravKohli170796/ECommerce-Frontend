import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as Yup from "yup";
import { ISearchProduct } from '../../models/productModel';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';
import { getProductById } from '../../services/productServices';

const showDeleteConfirmation = (prodId: string ,handleProductDelete : (prodId: string,imagesToDelete:string[]) => Promise<void>,imagesToDelete:string[]) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <Paper elevation={10}>
          <Box className="fCol fCenter my-2" sx={{ padding: "32px" }}>
            <Typography variant="h6">Delete Product</Typography>
            <Typography variant="body2">{`Are you sure to delete product with id ${prodId}`}</Typography>
            <Stack direction="row" spacing={2}>
              <Button size="small" color="secondary" variant="contained" onClick={()=>{handleProductDelete(prodId,imagesToDelete);onClose()}}>Delete</Button>
              <Button size="small" onClick={onClose} color="primary" variant="contained">Cancel</Button>
            </Stack>
          </Box>
        </Paper>
      );
    }
  });
};

function DeleteProduct() {

  const searchProductForm = useFormik<ISearchProduct>({
    initialValues: {
      productId: ""
    },
    validationSchema: Yup.object({
      productId: Yup.string().required("Please fill Product Id field"),
    }),
    onSubmit: async (values: ISearchProduct) => {
      const { data } = await getProductById(values.productId);
      showDeleteConfirmation(data._id || "",handleProductDelete,data.images);
    }
  });

  const handleProductDelete = async(prodId: string,imagesToDelete: string[]) => {
    await axiosProtectedInstance.delete(`/api/v1/product/deleteProduct/${prodId}`,{data:{imagesToDelete}});
    showNotificationMsg("Product successfully deleted.");
  }

  const renderSearchProduct = () => {
    return <form style={{ width: "100%" }} onSubmit={searchProductForm.handleSubmit}>
      <Box className="fRight fCol">
        <TextField
          color="secondary"
          label="Product Id"
          fullWidth
          size="small"
          name="productId"
          onChange={searchProductForm.handleChange}
          onBlur={searchProductForm.handleBlur}
          helperText={searchProductForm.errors.productId}
          error={(searchProductForm.touched.productId && searchProductForm.errors.productId && true) || false}
        />
        <Button type="submit" color="secondary" disabled={!(searchProductForm.dirty && searchProductForm.isValid)} variant="contained" size="small">Search Product</Button>
      </Box>
    </form>
  };

  return (
    <>
      {renderSearchProduct()}
    </>
  )
}

export default DeleteProduct;