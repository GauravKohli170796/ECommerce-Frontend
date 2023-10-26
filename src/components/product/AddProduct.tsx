import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormHelperText, IconButton, ImageList, ImageListItem, InputAdornment, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikProvider, useFormik } from "formik";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { colorsWithCodes } from '../../constants/AppConst';
import { IProduct } from '../../models/productModel';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';

const initialProductDetails: IProduct = {
  name: "",
  description: "",
  category: "",
  price: 0,
  quantity: 0,
  discount: 0,
  productDetails: [{ propKey: "", propValue: "", eleKey: shortid.generate() }, { propKey: "", propValue: "", eleKey: shortid.generate() }],
  images: [],
  colors: [],
  sizes: []
}



function AddProduct() {

  const [files, setFiles] = useState<any>([]);
  const AppState = GetAppState();
  const navigation = useNavigate();

  const addProductForm = useFormik<Partial<IProduct>>({
    enableReinitialize: true,
    initialValues: initialProductDetails,
    validationSchema: Yup.object({
      name: Yup.string().required("Please fill name field"),
      description: Yup.string().required("Please fill Description field"),
      category: Yup.string().required("Please fill Category field"),
      price: Yup.number().required("Please fill Price field"),
      quantity: Yup.number().required("Please fill Quantity field"),
      discount: Yup.number().required("Please fill Discount field"),
      images: Yup.array().of(Yup.string()).min(1, "Please provide at least one image"),
      sizes: Yup.array().of(Yup.string()).min(1, "Please provide at least one size"),
      colors: Yup.array().of(Yup.string()).min(1, "Please provide at least one color"),
      productDetails: Yup.array().of(Yup.object().shape({
        propKey: Yup.string().required("Please fill this field"),
        propValue: Yup.string().required("Please fill this field")
      }))
    }),
    onSubmit: async (values: Partial<IProduct>) => {
      const addProductBody = convertFormToAddRequest(values);
     const res = await axiosProtectedInstance.post(`/api/v1/product/addProduct`, {
        ...addProductBody
      });
      if(res?.data){
        showNotificationMsg("Product successfully added.");
        addProductForm.resetForm();
        navigation("/admin/adminController");
       }
      
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFiles(e.target.files);
  };

  const handleImageUpload = async (arrayHelpers: FieldArrayRenderProps) => {
    const formData = new FormData();
    for (const file of files)
      formData.append("images", file);
    const { data } = await axiosProtectedInstance.post("/api/v1/product/uploadFile", formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    });

    for (const url of data) {
      arrayHelpers.push(url);
    }
  }

  const renderProductImages = () => {
    return <FieldArray name="images" render={arrayHelpers => (
      <>
        <ImageList sx={{ width: "90%" }}>
          {Array.isArray(addProductForm.values.images) && addProductForm.values.images.map((item, index) => (
            <ImageListItem key={item} sx={{ border: ".1px solid lightgray" }}>
              <img
                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item}
                loading="lazy"
              />
              <Divider className='my-2' />
              {Array.isArray(addProductForm.values.images) && addProductForm.values.images?.length > 2 && <IconButton onClick={() => { arrayHelpers.remove(index) }}><DeleteIcon /></IconButton>}
            </ImageListItem>
          ))}
        </ImageList>
        <Divider sx={{ marginY: "16px" }} />
        <Typography variant="body1" sx={{ width: "100%", marginY: "16px" }}>Add Images</Typography>
        <TextField
          color="secondary"
          fullWidth
          size="small"
          name="Upload Images"
          type="file"
          onChange={handleImageChange}
          inputProps={{
            multiple: true,
            accept: "image/png, image/jpeg"
          }}
        />
        <Button color="secondary" onClick={() => handleImageUpload(arrayHelpers)} disabled={files.length === 0 ? true : false} type="button" variant="contained" size="small" sx={{ marginY: "16px", float: "right" }}>Upload Images</Button>
      </>
    )} />
  }

  const convertFormToAddRequest = (formData: Partial<IProduct>): Partial<IProduct> => {
    const addRequestData = Object.assign({}, formData);
    addRequestData.productDetails = {};
    for (const ele of formData.productDetails) {
      addRequestData.productDetails[ele.propKey] = ele.propValue;
    }
    return addRequestData;
  }

  const renderSizesOptions = () => {
    const sizeArr = ["xs", "s", "m", "l", "xl", "xxl", "fs"];
    return <Box className="fRow fLeft fWrap fullWidth mx-2">
      <FieldArray name="sizes" render={arrayHelpers => (
        <>
          {sizeArr.map((size: string) => {
            return <FormControlLabel
              onChange={(e: any) => {
                if (e.target.checked) {
                  arrayHelpers.push(e.target.value);
                  return;
                }
                const index = addProductForm.values.sizes?.indexOf(e.target.value) || -1;
                arrayHelpers.remove(index);
              }}
              onBlur={addProductForm.handleBlur}
              control={<Checkbox color='secondary'/>}
              label={size==="fs" ? "free size":size.toLowerCase()}
              value={size.toLowerCase()}
              
              key={size}
            />
          })}
          {addProductForm.errors.sizes && <Typography component="div" className='errorMsg' sx={{width:"100%",fontSize:"14px"}}>{addProductForm.errors.sizes}</Typography>}
        </>
      )}
      />
    </Box>
  };

  const renderProductProperties = () => {

    return <FieldArray name="productDetails" render={arrayHelpers => (<>
      {Array.isArray(addProductForm.values.productDetails) && addProductForm.values.productDetails.map((item, index) => (
        <TableRow key={item.eleKey}>
          <TableCell sx={{ minWidth: "120px" }}>
            <TextField
              color="secondary"
              hiddenLabel
              variant="outlined"
              size="small"
              name={`productDetails.${index}.propKey`}
              onChange={addProductForm.handleChange}
              onBlur={addProductForm.handleBlur}
              defaultValue={item.propKey}
              fullWidth
            />
            <ErrorMessage name={`productDetails.${index}.propKey`} component="div" className="errorMsg" />
          </TableCell>
          <TableCell sx={{ minWidth: "120px" }}>
            <TextField
              color="secondary"
              hiddenLabel
              variant="outlined"
              size="small"
              name={`productDetails.${index}.propValue`}
              onChange={addProductForm.handleChange}
              onBlur={addProductForm.handleBlur}
              defaultValue={item.propValue}
              fullWidth
            />
            <ErrorMessage name={`productDetails.${index}.propValue`} component="div" className="errorMsg" />
          </TableCell>
          <TableCell>{addProductForm.values.productDetails.length > 2 && <IconButton onClick={() => arrayHelpers.remove(index)} aria-label="fingerprint" color="secondary">
            <DeleteIcon />
          </IconButton>}
          </TableCell>
          {
            index === (addProductForm.values.productDetails.length - 1) && <TableCell><IconButton onClick={() => { arrayHelpers.insert(addProductForm.values.productDetails.length, { propKey: "", propValue: "", eleKey: shortid.generate() }) }} sx={{ backgroundColor: "lightgray" }} aria-label="fingerprint" color="primary">
              <AddIcon />
            </IconButton>
            </TableCell>
          }
        </TableRow>
      ))}
    </>
    )}
    />
  };

  const renderCategoryOptions = () => {
    return AppState.categories.map((category: string) => {
      return <MenuItem key={category} value={category.toUpperCase()}>{category.toUpperCase()}</MenuItem>
    });
  }

  const handleColorValues = (arrayHelper: FieldArrayRenderProps, values: string[]) => {
    if (values.length > 0) {
      arrayHelper.push(values[values.length - 1]);
      return;
    }
    addProductForm.values.colors = [];
  }

  const renderAddProduct = () => {
    return <form style={{ width: "100%" }} onSubmit={addProductForm.handleSubmit}>
      <Box className="fRight fCol">
        <TextField
          color="secondary"
          label="Name"
          fullWidth
          size="small"
          name="name"
          onChange={addProductForm.handleChange}
          onBlur={addProductForm.handleBlur}
          helperText={addProductForm.errors.name}
          error={(addProductForm.touched.name && addProductForm.errors.name && true) || false}
          value={addProductForm.values.name}
        />
        <TextField
          color="secondary"
          label="Description"
          fullWidth
          size="small"
          name="description"
          onChange={addProductForm.handleChange}
          onBlur={addProductForm.handleBlur}
          helperText={addProductForm.errors.description}
          error={(addProductForm.touched.description && addProductForm.errors.description && true) || false}
          value={addProductForm.values.description}
        />

        <FormControl fullWidth>
          <InputLabel size='small' color="secondary">Category</InputLabel>
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={addProductForm.values.category}
            label="Category"
            color="secondary"
            name="category"
            onChange={addProductForm.handleChange}
            onBlur={addProductForm.handleBlur}
            error={(addProductForm.touched.category && addProductForm.errors.category && true) || false}
          >
            {renderCategoryOptions()}
          </Select>
          <FormHelperText sx={{ color: "#d32f2f" }}>{addProductForm.errors.category}</FormHelperText>
        </FormControl>

        <TextField
          color="secondary"
          label="Price"
          fullWidth
          size="small"
          name="price"
          onChange={addProductForm.handleChange}
          onBlur={addProductForm.handleBlur}
          helperText={addProductForm.errors.price}
          error={(addProductForm.touched.price && addProductForm.errors.price && true) || false}
          value={addProductForm.values.price}
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupeeIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          color="secondary"
          label="Quantity"
          fullWidth
          size="small"
          name="quantity"
          onChange={addProductForm.handleChange}
          onBlur={addProductForm.handleBlur}
          helperText={addProductForm.errors.quantity}
          error={(addProductForm.touched.quantity && addProductForm.errors.quantity && true) || false}
          value={addProductForm.values.quantity}
          type="number"
        />

        <TextField
          color="secondary"
          label="Discount"
          fullWidth
          size="small"
          name="discount"
          onChange={addProductForm.handleChange}
          onBlur={addProductForm.handleBlur}
          helperText={addProductForm.errors.quantity}
          error={(addProductForm.touched.discount && addProductForm.errors.discount && true) || false}
          value={addProductForm.values.discount}
          type="number"
        />

        <FormikProvider value={addProductForm}>
          <FieldArray name="colors" render={arrayHelpers => (
            <Autocomplete
              multiple
              fullWidth
              id="tags-outlined"
              options={Object.keys(colorsWithCodes)}
              onChange={(_e, value: string[]) => { handleColorValues(arrayHelpers, value) }}
              onBlur={addProductForm.handleBlur}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="secondary"
                  label="Select Colors"
                  placeholder="Select Colors"
                  error={(addProductForm.touched.colors && addProductForm.errors.colors && true) || false}
                  helperText={addProductForm.errors.colors}
                  name="colors"
                  onChange={(e) => { console.log("colors") }}
                />
              )}
              renderTags={(tagValue) => {
                return tagValue.map((option, index) => (
                  <Chip
                    label={option}
                    key={option}
                    sx={{ backgroundColor: colorsWithCodes[option], color: option === "Black" ? "white" : "black" }}
                  />
                ))
              }}
            />)}
          />


          <Box sx={{ border: ".2px solid lightgrey", width: "99.5%" }}>
            <Typography sx={{ fontSize: "15px", alignSelf: "flex-start", margin: "8px", color: "#9c27b0" }} variant="body1">Select Available Sizes</Typography>
            {renderSizesOptions()}
          </Box>
          <Accordion sx={{ width: "90%", alignSelf: "center" }} className='my-1 mx-4'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="body1">Product Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableBody>
                    {renderProductProperties()}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: "90%", alignSelf: "center" }} className='my-1 mx-4'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="body1">Product Images</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderProductImages()}

            </AccordionDetails>
          </Accordion>
        </FormikProvider>
        <Button color="secondary" type="submit" disabled={!(addProductForm.dirty && addProductForm.isValid)} variant="contained" size="small">Add Product</Button>
        <Divider />
      </Box>
    </form >
  }

  return (
    <>
      {renderAddProduct()}
    </>

  )
}



export default AddProduct;