import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, ImageList, ImageListItem, InputAdornment, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikProvider, useFormik } from "formik";
import React, { useState } from 'react';
import shortid from 'shortid';
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { IProduct, ISearchProduct } from '../../models/productModel';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';
import { getProductById } from '../../services/productServices';

const initialProductDetails: IProduct = {
  name: "",
  description: "",
  category: "",
  price: 0,
  quantity: 0,
  discount: 0,
  productDetails: [],
  images: [],
  colors:[],
  sizes:[]
}



function UpdateProduct() {
  const AppState = GetAppState();
  const [productDetails, setProductDetails] = useState<Partial<IProduct>>(initialProductDetails);
  const [files, setFiles] = useState<any>([]);
  const updateProductForm = useFormik<Partial<IProduct>>({
    enableReinitialize: true,
    initialValues: Object.assign({}, productDetails),
    validationSchema: Yup.object({
      name: Yup.string().required("Please fill name field"),
      description: Yup.string().required("Please fill Description field"),
      category: Yup.string().required("Please fill Category field"),
      price: Yup.number().required("Please fill Price field"),
      quantity: Yup.number().required("Please fill Quantity field"),
      sizes: Yup.array().of(Yup.string()).min(1, "Please provide at least one size"),
      discount: Yup.number().required("Please fill Discount field"),
      images: Yup.array().of(Yup.string()),
      productDetails: Yup.array().of(Yup.object().shape({
        propKey: Yup.string().required("Please fill this field"),
        propValue: Yup.string().required("Please fill this field")
      }))
    }),
    onSubmit: async (values: Partial<IProduct>) => {
      const updateProductBody = convertFormToUpdateRequest(values);
      const response = await axiosProtectedInstance.put(`/api/v1/product/updateProduct/${searchProductForm.values.productId}`, {
        ...updateProductBody
      });
      if(response?.data){
        showNotificationMsg("Product successfully updated.");
        setProductDetails(initialProductDetails);
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
          {Array.isArray(updateProductForm.values.images) && updateProductForm.values.images.map((item, index) => (
            <ImageListItem key={item} sx={{ border: ".1px solid lightgray" }}>
              <img
                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item}
                loading="lazy"
              />
              <Divider className='my-2' />
              {Array.isArray(updateProductForm.values.images) && updateProductForm.values.images?.length > 2 && <IconButton onClick={() => { arrayHelpers.remove(index) }}><DeleteIcon /></IconButton>}
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

  const searchProductForm = useFormik<ISearchProduct>({
    initialValues: {
      productId: ""
    },
    validationSchema: Yup.object({
      productId: Yup.string().required("Please fill Product Id field"),
    }),
    onSubmit: async (values: ISearchProduct) => {
      setProductDetails(initialProductDetails);
      const { data } = await getProductById(values.productId);
      const renderData = convertProductDetailsRenderForm(data);
      setProductDetails(renderData);
    }
  });

  const convertProductDetailsRenderForm = (data: IProduct): IProduct => {
    const renderFormData = Object.assign({}, data);
    renderFormData.productDetails = [];
    Object.keys(data.productDetails).map((key, index) => {
      renderFormData.productDetails.push({ [`propKey`]: key, [`propValue`]: data.productDetails[key], eleKey: shortid.generate() });
      return renderFormData;
    });
    return renderFormData;
  };

  const convertFormToUpdateRequest = (formData: Partial<IProduct>): Partial<IProduct> => {
    const updateRequestData = Object.assign({}, formData);
    updateRequestData.productDetails = {};
    for (const ele of formData.productDetails) {
      updateRequestData.productDetails[ele.propKey] = ele.propValue;
    }
    return updateRequestData;
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
                const index = updateProductForm.values.sizes?.indexOf(e.target.value) || -1;
                arrayHelpers.remove(index);
              }}
              control={<Checkbox color='secondary' defaultChecked={productDetails.sizes?.includes(size)} />}
              label={size==="fs" ? "free size":size.toLowerCase()}
              value={size.toLowerCase()}
              key={size}
            />
          })}
        </>
      )}
      />
    </Box>
  };


  const renderCategoryOptions = () => {
    return AppState.categories.map((category: string) => {
      return <MenuItem selected={productDetails.category?.toUpperCase()===category.toUpperCase()} key={category} value={category.toUpperCase()}>{category.toUpperCase()}</MenuItem>
    });
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
        <Divider />
      </Box>
    </form>
  };

  const renderProductProperties = () => {

    return <FieldArray name="productDetails" render={arrayHelpers => (<>
      {Array.isArray(updateProductForm.values.productDetails) && updateProductForm.values.productDetails.map((item, index) => (
        <TableRow key={item.eleKey}>
          <TableCell sx={{ minWidth: "120px" }}>
            <TextField
              color="secondary"
              hiddenLabel
              variant="outlined"
              size="small"
              name={`productDetails.${index}.propKey`}
              onChange={updateProductForm.handleChange}
              onBlur={updateProductForm.handleBlur}
              defaultValue={item.propKey}
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
              onChange={updateProductForm.handleChange}
              onBlur={updateProductForm.handleBlur}
              defaultValue={item.propValue}
            />
            <ErrorMessage name={`productDetails.${index}.propValue`} component="div" className="errorMsg" />
          </TableCell>
          <TableCell>{updateProductForm.values.productDetails.length > 2 && <IconButton onClick={() => arrayHelpers.remove(index)} aria-label="fingerprint" color="primary">
            <DeleteIcon />
          </IconButton>}
          </TableCell>
          {
            index === (updateProductForm.values.productDetails.length - 1) && <TableCell><IconButton onClick={() => { arrayHelpers.insert(updateProductForm.values.productDetails.length, { propKey: "", propValue: "", eleKey: shortid.generate() }) }} sx={{ backgroundColor: "lightgray" }} aria-label="fingerprint" color="primary">
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

  const renderUpdateProduct = () => {
    return <form style={{ width: "100%" }} onSubmit={updateProductForm.handleSubmit}>
      <Box className="fRight fCol">
        <TextField
          color="secondary"
          label="Name"
          fullWidth
          size="small"
          name="name"
          onChange={updateProductForm.handleChange}
          onBlur={updateProductForm.handleBlur}
          helperText={updateProductForm.errors.name}
          error={(updateProductForm.touched.name && updateProductForm.errors.name && true) || false}
          value={updateProductForm.values.name}
        />
        <TextField
          color="secondary"
          label="Description"
          fullWidth
          size="small"
          name="description"
          onChange={updateProductForm.handleChange}
          onBlur={updateProductForm.handleBlur}
          helperText={updateProductForm.errors.description}
          error={(updateProductForm.touched.description && updateProductForm.errors.description && true) || false}
          value={updateProductForm.values.description}
        />

        <FormControl fullWidth>
          <InputLabel size='small'>Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size='small'
            value={updateProductForm.values.category}
            name="category"
            onBlur={updateProductForm.handleBlur}
            error={(updateProductForm.touched.category && updateProductForm.errors.category && true) || false}
            label="Category"
            onChange={updateProductForm.handleChange}
          >
            {renderCategoryOptions()}
          </Select>
        </FormControl>
        
        <TextField
          color="secondary"
          label="Price"
          fullWidth
          size="small"
          name="price"
          onChange={updateProductForm.handleChange}
          onBlur={updateProductForm.handleBlur}
          helperText={updateProductForm.errors.price}
          error={(updateProductForm.touched.price && updateProductForm.errors.price && true) || false}
          value={updateProductForm.values.price}
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
          onChange={updateProductForm.handleChange}
          onBlur={updateProductForm.handleBlur}
          helperText={updateProductForm.errors.quantity}
          error={(updateProductForm.touched.quantity && updateProductForm.errors.quantity && true) || false}
          value={updateProductForm.values.quantity}
          type="number"
        />

        <TextField
          color="secondary"
          label="Discount"
          fullWidth
          size="small"
          name="discount"
          onChange={updateProductForm.handleChange}
          onBlur={updateProductForm.handleBlur}
          helperText={updateProductForm.errors.quantity}
          error={(updateProductForm.touched.discount && updateProductForm.errors.discount && true) || false}
          value={updateProductForm.values.discount}
          type="number"
        />

        <FormikProvider value={updateProductForm}>
        <Box sx={{ border: ".2px solid lightgrey", width: "99.5%" }}>
            <Typography sx={{fontSize:"15px", alignSelf: "flex-start", margin: "8px", color: "#9c27b0" }} variant="body1">Update Available Sizes</Typography>
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
        <Button type="submit" color="secondary" disabled={!(updateProductForm.dirty && updateProductForm.isValid)} variant="contained" size="small">Update Product</Button>
        <Divider />
      </Box>
    </form >
  }

  return (
    <>
      {renderSearchProduct()}
      {productDetails.name !== "" && renderUpdateProduct()}
    </>

  )
}
export default UpdateProduct;