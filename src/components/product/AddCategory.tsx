import { Box, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { IAddCategory } from '../../models/productModel';
import { showNotificationMsg } from '../../services/createNotification';
import { addCategory } from '../../services/productServices';

function AddCategory() {
    const AppState = GetAppState();
    const addCategoryForm = useFormik<IAddCategory>({
        initialValues: {
            category: ""
        },
        validationSchema: Yup.object({
            category: Yup.string().lowercase().notOneOf(AppState.categories.map((item: string)=>item.toLowerCase()), 'This category is already present').required("Please fill Product Id field"),
        }),
        onSubmit: async (values: IAddCategory) => {
          const {data} =  await addCategory(values.category?.toUpperCase());
          if(data.modifiedCount){
            showNotificationMsg("Category is added successfully.");
            AppState?.setCategories([...AppState.categories,values.category.toUpperCase()]);
            addCategoryForm.resetForm();
          }
          
        }
      });
    const renderAddCategory = () => {
        return <form style={{ width: "100%" }} onSubmit={addCategoryForm.handleSubmit}>
          <Box className="fRight fCol">
            <TextField
              color="secondary"
              label="Category"
              fullWidth
              size="small"
              name="category"
              onChange={addCategoryForm.handleChange}
              onBlur={addCategoryForm.handleBlur}
              helperText={addCategoryForm.errors.category}
              error={(addCategoryForm.touched.category && addCategoryForm.errors.category && true) || false}
            />
            <Button type="submit" color="secondary" disabled={!(addCategoryForm.dirty && addCategoryForm.isValid)} variant="contained" size="small">Add Category</Button>
          </Box>
        </form>
      };

  return (
    <>
    {renderAddCategory()}
    </>
  )

  
}

export default AddCategory;