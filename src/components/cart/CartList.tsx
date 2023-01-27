import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../models/productModel';
import { getCartItems } from '../../services/productServices';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import EmptyList from './EmptyList';

function CartList() {
  const navigate = useNavigate();
  const [wishListProducts, setWishListProducts] = useState<IProduct[] | null>(null);;

  useEffect(() => {
    const tokenDetails = localStorage.getItem("auth");
    if (!tokenDetails) {
      navigate("/auth/login");
      return;
    }
    async function getWishListProducts() {
      const { data } = await getCartItems();
      if (data.length) {
        setWishListProducts(data);
      }
    }
    getWishListProducts();

  }, [navigate]);


  const renderEmptyWishList = () => {
    return <EmptyList listName='Shopping Cart'/>
  };

  const renderWishListProducts = () => {
    return <></>
  };

  return (
    <>
      <Header />
      <Box className="headerMargin"></Box>
      {wishListProducts && renderWishListProducts()}
      {!wishListProducts && renderEmptyWishList()}
      <Footer />
    </>

  )
}

export default CartList;