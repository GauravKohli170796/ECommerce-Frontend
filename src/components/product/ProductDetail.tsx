import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Chip, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Paper, Select, Stack, Table, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from 'formik';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { IProduct } from '../../models/productModel';
import { showNotificationMsg } from '../../services/createNotification';
import { addWishListItem, getProductById, getWishListItems } from "../../services/productServices";
import Footer from '../footer/Footer';
import Header from '../header/Header';
import ProdHeader from '../header/ProdHeader';
import ProductScroll from './ProductScroll';

interface IContactForm {
  email: string;
  message: string
}

function ProductDetail() {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState<any | {}>({});
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const AppState = GetAppState();
  const priceWithoutDiscount: number = (productDetail?.price / (1 - (productDetail?.discount / 100))) || productDetail?.price;
  const [isAlreadyWishlisted, setIsAlreadyWishListed] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAlreadyWishListed(false);
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddtoWishlist = async () => {
    const authDetails = localStorage.getItem("auth");
    if (!authDetails) {
      showNotificationMsg("Please login to use Wishlist.");
      return;
    };
    if(!id){
      return;
    }
    const wishListProduct = {
      productId: id
    };
    const { data } = await addWishListItem(wishListProduct);
    AppState?.setWishListItems([...AppState.wishListItems, data]);
    showNotificationMsg("Product added to Wish List");
    setIsAlreadyWishListed(true);
  }

  const fetchProductDetail = async () => {
    try {
      if (!id) {
        return;
      }
      setProductDetail({});
      const { data } = await getProductById(id);
      setProductDetail(data);
      const authDetails = localStorage.getItem("auth");
      if (!authDetails) {
        return;
      }
      const response = await getWishListItems();
      for (const item of response.data) {
        if (((item.productId) as Partial<IProduct>)?._id === id) {
          setIsAlreadyWishListed(true);
        }
      }


    } catch (err) {
      console.error(err);
    }
  };

  const contactForm = useFormik<IContactForm>({
    initialValues: {
      email: "",
      message: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be valid email").required("Please fill Email field"),
      message: Yup.string().max(250, "Message must be less than 250 characters").min(25, "Message must be more than 25 characters long").required("Please fill Message field"),
    }),
    onSubmit: async (values: IContactForm) => {
      console.log(values);
    }
  });


  const handleImageClick = (index: number) => {
    handleOpen();
    setImage(index);
  };

  const handleImageScroll = (index: number) => {
    let scrollWidth = 0;
    while (index) {
      scrollWidth += ((document.getElementById(`image${index}`) as HTMLImageElement).width || 0) + 20;
      index--;
    }
    (document.getElementById("imageContainer") as HTMLDivElement).scrollLeft = scrollWidth;
  }


  const renderProductImages = () => {
    if (productDetail.images) {
      return <>
        <Box id="imageContainer" sx={{ overflowX: "scroll", display: "flex", marginBottom: "16px" }}>
          {productDetail.images.map((imgx: string, index: number) => {
            return <img className='prodImage' onClick={() => { handleImageClick(index) }} id={`image${index}`} src={imgx} alt="xxx" key={imgx} style={{ marginRight: "20px" }}></img>
          })}
        </Box>
        <Box sx={{ overflowX: "scroll", display: "flex", margin: "16px" }}>
          {productDetail.images.map((imgx: string, index: number) => {
            return <img src={imgx} height="50" width="100" onClick={() => handleImageScroll(index)} alt="xxx" key={imgx} style={{ marginRight: "20px", objectFit: "cover" }}></img>
          })}
        </Box>
      </>
    }
  }

  const renderProductDetails = () => {
    return productDetail.productDetails && Object.keys(productDetail.productDetails).map((key) => {
      return <TableRow key={key}>
        <TableCell sx={{ fontWeight: 600 }}>{key.toUpperCase()}</TableCell>
        <TableCell>{productDetail.productDetails[key].toUpperCase()}</TableCell>
      </TableRow>
    })
  }

  const handleSizeClick = () => {
    console.log("size clicked");
  }

  const renderQuantitySelector = () => {
    return <FormControl sx={{ width: "50%" }}>
      <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
      <Select
        className='leftText'
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        // value={age}
        label="Quantity"
      // onChange={handleChange}
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
      </Select>
    </FormControl>
  }

  const renderContactForm = () => {
    return <Box className="mixBackground" sx={{ marginY: "32px", padding: "32px" }}>

      <form style={{ width: "100%" }} className="centreFlex my-4" onSubmit={contactForm.handleSubmit}>
        <Paper elevation={5} sx={{ width: { xs: "90%", md: "60%", lg: "40%" } }}>

          <Stack className='p-2' spacing={2}>

            <Typography className="section-head" fontSize="large">
              Interested in Product
            </Typography>

            <TextField
              color="secondary"
              error={(contactForm.touched.email && contactForm.errors.email && true) || false}
              label="Email"
              helperText={contactForm.errors.email}
              onBlur={contactForm.handleBlur}
              onChange={contactForm.handleChange}
              name="email"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              color="secondary"
              error={(contactForm.touched.email && contactForm.errors.email && true) || false}
              label="Product Id"
              fullWidth
              defaultValue={id}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              color="secondary"
              error={(contactForm.touched.message && contactForm.errors.message && true) || false}
              label="Message"
              helperText={contactForm.errors.message}
              onBlur={contactForm.handleBlur}
              onChange={contactForm.handleChange}
              name="message"
              multiline
              minRows={3}
              maxRows={3}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button disabled={!(contactForm.dirty && contactForm.isValid)} type="submit" fullWidth variant="contained">Contact Me</Button>

          </Stack>
        </Paper>
      </form>
    </Box>
  }

  const renderSizes = () => {
    return <>
      <Chip label="XS" variant="outlined" onClick={handleSizeClick} />
      <Chip label="S" variant="outlined" onClick={handleSizeClick} />
      <Chip label="M" variant="outlined" onClick={handleSizeClick} />
      <Chip label="L" variant="outlined" onClick={handleSizeClick} />
      <Chip label="XL" variant="outlined" onClick={handleSizeClick} />
      <Chip label="XXL" variant="outlined" onClick={handleSizeClick} />
    </>
  }

  return <>
    {Object.keys(productDetail).length > 1 && <>
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <Box sx={{ width: { sm: "95vw", md: "45vw" }, marginY: "16px", alignSelf: "flex-start", justifyContent: "flex-start", }}>
          <Stack direction="column" sx={{ marginX: "4px", display: "flex", justifyContent: "center", maxWidth: "99vw" }}>
            {renderProductImages()}
            <Stack direction="row" spacing={2}>
              {!isAlreadyWishlisted && <Button color="secondary" onClick={handleAddtoWishlist} variant="contained" endIcon={<FavoriteIcon />} fullWidth>Wishlist</Button>}
              {isAlreadyWishlisted && <Button color="secondary" onClick={() => { navigate("/user/wishlist") }} variant="contained" endIcon={<FavoriteIcon />} fullWidth>Go to Wishlist</Button>}
              <Button variant="contained" fullWidth endIcon={<ShoppingCartIcon />}>Add to Cart</Button>
            </Stack>
          </Stack>
        </Box>
        <Divider sx={{ display: { xs: "block", md: "none", width: "100%" } }}></Divider>
        <Box sx={{ width: { xs: "95vw", md: "45vw" }, marginY: "16px", alignSelf: "flex-start", justifyContent: "flex-start", marginX: "5px" }}>
          <Stack spacing={2}>
            <Typography fontSize={24} className="leftText" variant="h3">{productDetail.name}</Typography>
            <Typography className="leftText" variant="body1">{productDetail.description}</Typography>
            <Box sx={{ fontSize: "20px", textAlign: "left" }}>
              <CurrencyRupeeIcon fontSize="small" />  {productDetail.price}
              <Typography component="span" sx={{ textDecoration: "line-through", marginX: "5px", color: "rgb(38, 165, 65)" }} variant="body2">
                {parseInt(priceWithoutDiscount.toString())}
              </Typography>
              <Typography component="span" sx={{ color: "rgb(38, 165, 65)" }} variant="body2">
                {`discount ${productDetail.discount}%`}
              </Typography>
            </Box>
            <Divider />
            <Typography fontSize={20} className="leftText" variant="caption">Product Details</Typography>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                {renderProductDetails()}
              </Table>
            </TableContainer>
            <Divider />
            <Typography fontSize={20} className="leftText" variant="caption">Sizes</Typography>
            <Stack direction="row" spacing={2}>
              {renderSizes()}
            </Stack>
            <Divider />
            <Typography fontSize={20} className="leftText" variant="caption">Select Quantity</Typography>
            {renderQuantitySelector()}
          </Stack>
        </Box>
      </Box>
      <Divider />
      <ProdHeader />
      <Divider />
      <ProductScroll name="Recommended" />
      {renderContactForm()}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={{ display: "flex", maxHeight: "90%", maxWidth: "90%", overflow: "scroll", flexDirection: "column", backgroundColor: "white" }}>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-end", backgroundColor: "#9c27b0", color: "white", marginY: "8px" }}><CloseIcon /></IconButton>
          <img src={productDetail.images[image]} alt="xxx" style={{ maxHeight: "80vh" }}></img>
        </Box>
      </Modal>
      <Footer />

    </>}
  </>
}

export default ProductDetail;
