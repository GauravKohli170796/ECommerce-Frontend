import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Stack } from "@mui/system";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationType } from '../../constants/AppConst';
import { ICartProduct } from '../../models/productModel';
import { showNotificationMsg } from '../../services/createNotification';
import { deleteCartItem, getCartItems } from '../../services/productServices';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import ProdHeader from '../header/ProdHeader';
import ProductScroll from '../product/ProductScroll';
import EmptyList from './EmptyList';

function CartList() {
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState<ICartProduct[]>([]);;

  useEffect(() => {
    const tokenDetails = localStorage.getItem("auth");
    if (!tokenDetails) {
      showNotificationMsg("You need to login first", notificationType.WARNING);
      navigate("/auth/login");
      return;
    }
    async function getcartProducts() {
      const { data } = await getCartItems();
      if (data.length) {
        setCartProducts(data);
      }
    }
    getcartProducts();

  }, [navigate]);


  const renderEmptyCart = () => {
    return <EmptyList listName='Shopping Cart' />
  };

  const removeItemFromCart = async (productId: string) => {
    const { data } = await deleteCartItem(productId);
    if (data.deletedCount === 1) {
      showNotificationMsg('Product removed from Cart');
      const tmpCartProducts: ICartProduct[] = cartProducts?.filter(item => item._id !== productId);
      setCartProducts(tmpCartProducts);
    }

  };

  const openCartProd = (productId: string) => {
    navigate(`/product/productDetail/${productId}`);
  };

  const renderQuantitySelector = (cartItemDetails: ICartProduct) => {
    return <FormControl sx={{marginX:"16px"}}>
      <InputLabel id="demo-simple-select-label" size="small" color="secondary">Qty</InputLabel>
      <Select
        size="small"
        color="secondary"
        sx={{ width: "fit-content"}}
        className='leftText'
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={cartItemDetails.quantity}
        label="Qty"
        onChange={(e) => { console.log("dwjcdcdscsd") }}
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

  const renderWishListProducts = () => {
    return <>
      <Typography className="section-head my-4" sx={{ fontSize: "25px" }}>
        My Cart
      </Typography>
      <Divider sx={{ marginY: "16px", width: "96vw" }} />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {cartProducts && cartProducts.map((item) => {
          return <Card key={item._id} sx={{ display: 'flex', marginY: "32px", marginX: "8px", padding: "16px" }}>



            <CardMedia
              component="img"
              sx={{ width: 180 }}
              image={item.productId.images[0]}
              alt="Live from space album cover"
            />


            <Box>

              <CardContent sx={{ width: "45vw" }}>

                <Typography gutterBottom variant="body1" component="div" sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}>
                  {item.productId.name}
                </Typography>

                <Typography
                  sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}
                  variant="body2"
                  color="text.secondary"
                >
                  {item.productId.description}
                </Typography>
                <Stack direction="row" spacing={2} className="my-1">
                  <CurrencyRupeeIcon fontSize="small" />  {item.productId.price}
                  <Typography sx={{ color: "rgb(38, 165, 65)" }} variant="body2">
                    {`discount ${item.productId.discount}%`}
                  </Typography>
                </Stack>


                <Typography variant="caption">{`Size: ${item.size} , Color: ${item.color}`} </Typography>
              </CardContent>

              {renderQuantitySelector(item)}
              <CardActions sx={{ float: "right", display: { xs: "none", sm: "block" } }}>

                <Button variant='contained' color="secondary" onClick={() => { removeItemFromCart(item._id) }} endIcon={<DeleteIcon />}>Remove</Button>
                <Button variant='contained' color="secondary" onClick={() => { openCartProd(item.productId._id) }} endIcon={<VisibilityIcon />}>Open</Button>
              </CardActions>

              <CardActions sx={{ float: "right", display: { xs: "block", sm: "none" } }}>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }} onClick={() => { removeItemFromCart(item._id) }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }} onClick={() => { openCartProd(item.productId._id) }}>
                  <VisibilityIcon />
                </IconButton>
              </CardActions>
            </Box>
          </Card>
        })}
      </Box>
    </>
  };

  return (
    <>
      <Header />
      {cartProducts.length > 0 && renderWishListProducts()}
      {cartProducts.length === 0 && renderEmptyCart()}
      <Divider sx={{ marginY: "16px", width: "96vw" }} />
      <ProdHeader />
      <ProductScroll name="Shop" />
      <Footer />
    </>

  )
}

export default CartList;