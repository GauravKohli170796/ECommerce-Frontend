import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Paper, Rating, Select, Stack, Table, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from 'formik';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { AppConst, colorsWithCodes, notificationType, productHeadingType } from '../../constants/AppConst';
import useCartWishListFetch from '../../hooks/useCartWishListFetch';
import { ICartProductReq } from '../../models/productModel';
import { showNotificationMsg } from '../../services/createNotification';
import { addCartItems, addWishListItem, getProductById } from "../../services/productServices";
import Footer from '../footer/Footer';
import Header from '../header/Header';
import ProdHeader from '../header/ProdHeader';
import ProductScroll from './ProductScroll';

interface IContactForm {
  email: string;
  message: string
}

const initialCartDetails: ICartProductReq = {
  productId: "",
  size: "",
  color: "",
  quantity: "1"
}


function ProductDetail() {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState<any | {}>({});
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(0);
  const [borderIndex, setBorderIndex] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const priceWithoutDiscount: number = (productDetail?.price / (1 - (productDetail?.discount / 100))) || productDetail?.price;
  const [isAlreadyWishlisted, setIsAlreadyWishListed] = useState<boolean>(false);
  const [isAlreadyCartItem, setIsAlreadyCartItem] = useState<boolean>(false);
  const [cartItemDetails, setCartItemDetails] = useState<ICartProductReq>(initialCartDetails);
  const navigate = useNavigate();
  const fetchCartWishProducts = useCartWishListFetch();
  const AppState = GetAppState();

  useEffect(() => {
    setIsAlreadyWishListed(false);
    fetchProductDetail();
    fetchWishCartListProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddtoWishlist = async () => {
    const authDetails = localStorage.getItem("auth");
    if (!authDetails) {
      showNotificationMsg("Please login to use Wishlist.", notificationType.WARNING);
      return;
    };
    if (!id) {
      return;
    }
    const wishListProduct = {
      productId: id
    };
    const {data} = await addWishListItem(wishListProduct);
    if (data?.productId._id) {
      AppState.setWishList([...AppState.wishList,data]);
      showNotificationMsg("Product added to Wish List.");
      setIsAlreadyWishListed(true);
    }
  };

  const handleAddtoCart = async () => {
    if (!(cartItemDetails.color && cartItemDetails.size)) {
      showNotificationMsg("Please select size and color first.", notificationType.DANGER);
      return;
    }
    const authDetails = localStorage.getItem("auth");
    if (!authDetails) {
      showNotificationMsg("Please login to use Cart.", notificationType.WARNING);
      return;
    };
    if (!id) {
      return;
    }
    const cartProduct: ICartProductReq = {
      productId: id,
      quantity: cartItemDetails.quantity,
      color: cartItemDetails.color,
      size: cartItemDetails.size
    };
    const {data} = await addCartItems(cartProduct);
    if (data?.productId?._id) {
      AppState.setCartList([...AppState.cartList,data]);
      showNotificationMsg("Product added to Cart.");
      setIsAlreadyCartItem(true);
    }
  }

  const fetchWishCartListProducts = async () => {
    const authDetails = localStorage.getItem("auth");
    if (!authDetails) {
      return;
    }
    const response = await fetchCartWishProducts();
    for (const item of response?.wishList) {
      if (item.productId._id === id) {
        setIsAlreadyWishListed(true);
      }
    }
    for (const item of response?.cartList) {
      if (item.productId._id === id) {
        setIsAlreadyCartItem(true);
      }
    }
  }

  const fetchProductDetail = async () => {
    if (!id) {
      return;
    }
    setProductDetail({});
    const { data } = await getProductById(id);
    data.productDetails = { productId: id, ...data.productDetails };
    setProductDetail(data);
    setTimeout(() => {
      const ele = document.getElementById("imageContainer");
      (document.getElementById("imageContainer") as HTMLDivElement).scrollLeft = ele?.scrollWidth || 0;
    }, 1000);
    setTimeout(() => {
      (document.getElementById("imageContainer") as HTMLDivElement).scrollLeft = 0;
    }, 3000);
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
    setBorderIndex(index);
    while (index) {
      scrollWidth += ((document.getElementById(`image${index}`) as HTMLImageElement).width || 0) + 20;
      index--;
    }
    (document.getElementById("imageContainer") as HTMLDivElement).scrollLeft = scrollWidth;
  }


  const renderProductImages = () => {
    if (productDetail.images) {
      return <>
        <Box id="imageContainer" sx={{ overflowX: "scroll", display: "flex", marginBottom: "16px", scrollBehavior: "smooth"}}>
          {productDetail.images.map((imgx: string, index: number) => {
            return <img className='prodImage' onClick={() => { handleImageClick(index) }} id={`image${index}`} src={imgx} alt="xxx" key={imgx} style={{ marginRight: "20px" }}></img>
          })}
        </Box>
        <Typography color="secondary" sx={{ fontSize: "15px", marginLeft: "10px" }}>{`Swipe left of yours to see all Images ----->`}</Typography>
        <Typography color="primary" sx={{ fontSize: "15px", marginLeft: "10px" }}>{`Click on Image to zoom it.`}</Typography>
        <Box sx={{ overflowX: "scroll", display: "flex", margin: "16px" }}>
          {productDetail.images.map((imgx: string, index: number) => {
            return <img src={imgx} height="50" width="100" onClick={() => handleImageScroll(index)} alt="xxx" key={imgx} style={{ marginRight: "20px", objectFit: "cover", border: borderIndex === index ? "2px solid purple" : "none" }}></img>
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

  const renderRatingComponent = () => {
    return <>
      {[1, 2, 3, 4, 5].map((rating: number) => (
        <Stack key={rating} direction="row" spacing={4}>
          <Rating
            name="text-feedback"
            value={rating}
            readOnly
            precision={0.5}
          />
          <Box sx={{ ml: 2 }}>(0)</Box>
        </Stack>))}
    </>
  };

  const renderQuantitySelector = () => {
    return <FormControl sx={{ width: "50%" }}>
      <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
      <Select
        className='leftText'
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={cartItemDetails.quantity}
        label="Quantity"
        onChange={(e) => { setCartItemDetails({ ...cartItemDetails, quantity: e.target.value }) }}
      >
        {[1, 2, 3, 4, 5].map((quantity: number) => {
          return <MenuItem
            value={quantity.toString()}
            key={quantity}
          >{quantity}</MenuItem>
        })}
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
      {["xs", "s", "m", "l", "xl", "xxl", "fs"].map((size: string) => {
        if (productDetail.sizes.includes(size)) {
          return <Button disableFocusRipple disableRipple size="small"

            key={size}
            variant="outlined"
            sx={{
             "&:hover":{backgroundColor: cartItemDetails.size === size ? "#ba68c8" : ""},
              backgroundColor: cartItemDetails.size === size ? "#ba68c8" : "",
              color: cartItemDetails.size === size ? "white" : "",
              padding: "4px",
              height: "30px",
              width: "30px",
              minWidth: "fit-content",
            }}
            onClick={() => { setCartItemDetails({ ...cartItemDetails, size: size }) }} >{size}</Button>
        }
        return null;

      })}
    </>
  }

  const handleShare= async()=>{
    const shareData = {
      title: `${productDetail.name}`,
      text: `${productDetail.description}`,
      url: `${AppConst.FrontendUrl}product/productDetail/${id}`
    };
    try {
      await navigator.share(shareData)
    } catch (err) {
      showNotificationMsg("Failed to share.",notificationType.DANGER);
    }
  }

  const renderColors = () => {
    return <>
      {productDetail.colors.map((color: string) => {
        return <Button disableRipple  key={color} variant="outlined"
          sx={{
            backgroundColor: colorsWithCodes[color],
            "&:hover":{backgroundColor: colorsWithCodes[color]},
            height: "30px",
            width: "30px",
            minHeight: cartItemDetails.color === color ? "35px" : "30px",
            minWidth: cartItemDetails.color === color ? "35px" : "30px",
            border: cartItemDetails.color === color ? "2px solid #ba68c8" : "",
          }}
          onClick={() => { setCartItemDetails({ ...cartItemDetails, color: color }) }}
        />
      })
      }
    </>
  }

  return <>
    {Object.keys(productDetail).length > 1 && <>
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <Box sx={{ width: { sm: "95vw", lg: "45vw" }, position: { lg: "sticky" }, left: 0, top: 110, marginY: "16px", alignSelf: "flex-start", justifyContent: "flex-start", }}>
          <Stack direction="column" sx={{ marginX: "4px", display: "flex", justifyContent: "center", maxWidth: "99vw" }}>
            {renderProductImages()}
          </Stack>
          <Divider />
        </Box>
        <Divider sx={{ display: { xs: "block", md: "none", width: "100%" } }}></Divider>
        <Box sx={{ width: { xs: "95vw", lg: "45vw" }, marginY: "16px", alignSelf: "flex-start", justifyContent: "flex-start", marginX: "5px", borderLeft: ".1px solid lightgrey", paddingLeft: "8px" }}>
          <Stack spacing={2}>
            <Stack direction="row" className='fRow' sx={{justifyContent:"space-between",alignItems:"center"}}>
            <Typography fontSize={24} className="leftText" variant="h3">{productDetail.name}</Typography>
            <IconButton disableFocusRipple disableRipple onClick={handleShare} sx={{justifySelf:"flex-end" , backgroundColor: "#9c27b0", color: "white", marginY: "8px" }}><ShareIcon /></IconButton>
            </Stack>
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
            <Typography fontSize={18} className="leftText" variant="body1" >Product Details</Typography>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                {renderProductDetails()}
              </Table>
            </TableContainer>
            <Divider />
            <Typography fontSize={18} className="leftText" variant="caption">Select Colors</Typography>
            {<Typography fontSize={12}>{`Selected Color : ${cartItemDetails.color || "none"}`}</Typography>}
            <Stack direction="row" sx={{alignItems:"center"}} spacing={4}>
              {renderColors()}
            </Stack>
            <Divider />
            <Typography fontSize={18} className="leftText" variant="caption">Select Quantity</Typography>
            {renderQuantitySelector()}
            <Divider />
            <Typography fontSize={18} sx={{ marginTop: "16px" }} className="leftText" variant="caption">Select Size</Typography>
            <Stack direction="row" className='my-2' spacing={2}>
              {renderSizes()}
            </Stack>
            <Divider />
            <Stack direction="row" spacing={2}>
              {!isAlreadyWishlisted && <Button color="secondary" onClick={handleAddtoWishlist} variant="outlined" endIcon={<FavoriteIcon />} fullWidth>Wishlist</Button>}
              {isAlreadyWishlisted && <Button color="secondary" onClick={() => { navigate("/user/wishlist") }} variant="contained" endIcon={<FavoriteIcon />} fullWidth>Go to Wishlist</Button>}

              {!isAlreadyCartItem && <Button color="secondary" onClick={handleAddtoCart} variant="outlined" endIcon={<ShoppingCartIcon />} fullWidth>Add to Cart</Button>}
              {isAlreadyCartItem && <Button color="secondary" onClick={() => { navigate("/user/shoppingCart") }} variant="contained" endIcon={<ShoppingCartIcon />} fullWidth>Go to Cart</Button>}
            </Stack>
            <Divider />
            <Typography fontSize={18} sx={{ marginTop: "16px" }} className="leftText" variant="caption">Customer Ratings</Typography>
            <Typography fontSize={12} sx={{ marginTop: "16px" }} className="leftText" variant="caption">Total 0 ratings and 0 reviews</Typography>
            {renderRatingComponent()}
          </Stack>
        </Box>
      </Box>
      <Divider />
      <ProdHeader />
      <Divider />
      <ProductScroll name={productHeadingType.RECOMMENDED} />

      {/* {renderContactForm()} */}
      
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
