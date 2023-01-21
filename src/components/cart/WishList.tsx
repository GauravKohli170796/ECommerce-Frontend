import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../models/productModel';
import { getWishListItems } from '../../services/productServices';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import EmptyList from './EmptyList';

function WishList() {
  const navigate = useNavigate();
  const [wishListProducts, setWishListProducts] = useState<IProduct[] | null>(null);;

  useEffect(() => {
    const tokenDetails = localStorage.getItem("auth");
    if (!tokenDetails) {
      navigate("/auth/login");
      return;
    }
    async function getWishListProducts() {
      const { data } = await getWishListItems();
      if (data.length) {
        setWishListProducts(data);
      }
    }
    getWishListProducts();

  }, [navigate]);


  const renderEmptyWishList = () => {
    return <EmptyList listName='Wish List'/>
  };

  const renderWishListProducts = () => {
    return <></>
  };

  return (
    <>
      <Header />
      {wishListProducts && renderWishListProducts()}
      {!wishListProducts && renderEmptyWishList()}
      <Footer />
    </>

  )
}

export default WishList;