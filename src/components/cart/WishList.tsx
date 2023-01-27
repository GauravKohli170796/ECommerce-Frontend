import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Card, CardActions, CardContent, CardMedia, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IWishListProduct } from '../../models/productModel';
import { showNotificationMsg } from '../../services/createNotification';
import { deleteWishListItems, getWishListItems } from '../../services/productServices';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import ProdHeader from '../header/ProdHeader';
import ProductScroll from '../product/ProductScroll';
import EmptyList from './EmptyList';

function WishList() {
  const navigate = useNavigate();
  const [wishListProducts, setWishListProducts] = useState<IWishListProduct[]>([]);

  const removeItemFromWishList = async (productId: string) => {
    const { data } = await deleteWishListItems(productId);
    if (data.deletedCount === 1) {
      showNotificationMsg('Product removed from Wish list');
      const tmpWishListProducts:IWishListProduct[] = wishListProducts?.filter(item=> item.productId._id !==productId);
      setWishListProducts(tmpWishListProducts);
    }

  };

  const openWishListProd = (productId: string) => {
    navigate(`/product/productDetail/${productId}`);
  };

  useEffect(() => {
    const tokenDetails = localStorage.getItem("auth");
    if (!tokenDetails) {
      navigate("/auth/login");
      return;
    };

    async function getWishListProducts() {
      const { data } = await getWishListItems();
      if (data.length) {
        setWishListProducts(data);
      }
    };

    getWishListProducts();

  }, [navigate]);


  const renderEmptyWishList = () => {
    return <EmptyList listName='Wish List' />
  };

  const renderWishListProducts = () => {
    return <>
      <Typography className="section-head my-4" sx={{ fontSize: "25px" }}>
        My Wishlist
      </Typography>
      <Divider sx={{ marginY: "16px", width: "96vw" }} />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {wishListProducts && wishListProducts.map((item) => {
          return <Card key={item._id} sx={{ display: 'flex', marginY: "32px", marginX: "8px", padding: "16px" }}>



            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={item.productId.images[0]}
              alt="Live from space album cover"
            />


            <Box>

              <CardContent sx={{ width: "50vw" }}>

                <Typography gutterBottom variant="body1" component="div" sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left"}}>
                  {item.productId.name}
                </Typography>

                <Typography
                  sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}
                  variant="body2"
                  color="text.secondary"
                >
                  {item.productId.description}
                </Typography>

              </CardContent>

              <CardActions sx={{ float: "right", display: { xs: "none", sm: "block" } }}>
                <Button variant='contained' color="secondary" onClick={() => { removeItemFromWishList(item.productId._id) }} endIcon={<DeleteIcon />}>Remove</Button>
                <Button variant='contained' color="secondary" onClick={() => { openWishListProd(item.productId._id) }} endIcon={<VisibilityIcon />}>Open</Button>
              </CardActions>

              <CardActions sx={{ float: "right", display: { xs: "block", sm: "none" } }}>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }} onClick={() => { removeItemFromWishList(item.productId._id) }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }} onClick={() => { openWishListProd(item.productId._id) }}>
                  <VisibilityIcon />
                </IconButton>
              </CardActions>
            </Box>
          </Card>
        })}
      </Box>
    </>
  }

  return (
    <>
      <Header />
      <Box className="headerMargin"></Box>
      {wishListProducts.length > 0 && renderWishListProducts()}
      {wishListProducts.length === 0  && renderEmptyWishList()}
      <Divider sx={{ marginY: "16px", width: "96vw" }} />
      <ProdHeader />
      <ProductScroll name="Shop" />
      <Footer />
    </>

  )
}

export default WishList;