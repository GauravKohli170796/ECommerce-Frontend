import { Divider, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { GetAppState } from "../../AppContext";
import { AppConst } from "../../constants/AppConst";
import { IAllProductApiResponse, IProduct } from "../../models/productModel";
import { getAllProducts } from "../../services/productServices";
import CarouselProvider from "../carousel/CarouselProvider";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import ProdHeader from "../header/ProdHeader";
import ProductCard from "./ProductCard";
import ProductScroll from "./ProductScroll";

function AllProducts() {
  const [products, setProducts] = useState<IAllProductApiResponse | null>(null);
  const AppState = GetAppState();

  const tmpImages = [
    "https://res.cloudinary.com/dnqwvvtqf/image/upload/v1673163899/ProductTest/wswzzowfjubzqyyijgc0.webp",
    "https://res.cloudinary.com/dnqwvvtqf/image/upload/v1673163904/ProductTest/gvlsfbia6a5r5myjmqsl.webp",
    "https://res.cloudinary.com/dnqwvvtqf/image/upload/v1673163917/ProductTest/y5cdawyggg0gjjfaddhv.webp"
  ];
  const featureProductRef = useRef<HTMLDivElement>(null);
  const paginationCount = Math.ceil((products?.totalProducts[0]?.totalProducts || 0) / AppConst.productsPerPage);


  useEffect(() => {
    async function fetchAllProducts() {
      const { data } = await getAllProducts("1");
      AppState?.setInitialProducts(data);
      setProducts(data);
    }
    const initialProducts = AppState.initialProducts;
    if (initialProducts) {
      setProducts(initialProducts);
      return;
    }
    fetchAllProducts();
  }, [AppState]);




  const callProductsPage = async (page: string) => {
    const { data } = await getAllProducts(page);
    const tmpProducts = Object.assign({}, products);
    tmpProducts.allProducts = data.allProducts;
    tmpProducts.totalProducts = data.totalProducts;
    setProducts(tmpProducts);

    setTimeout(() => {
      featureProductRef.current?.scrollIntoView({ behavior: "smooth", inline: "start" });
    }, 10)
  };

  const renderAllProducts = () => {
    return products?.allProducts.map((product: IProduct) => {
      return <ProductCard key={product._id} product={product} />;
    });
  };

  return (
    <>
      <Header />
      <CarouselProvider imagesArr={tmpImages} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "20px 2px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >

        <Divider sx={{ marginY: "16px", width: "96vw" }} />
        <ProductScroll name="Latest"/>
        <Typography ref={featureProductRef} ></Typography>
        <ProdHeader/>
        <Divider sx={{ marginY: "16px", width: "96vw" }} />
        <Typography className="section-head" sx={{ fontSize: "25px" }}>
          Featured Products
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px 10px",
            flexWrap: "wrap"
          }}
        >
          {renderAllProducts()}
        </Box>

        {paginationCount > 0 && (
          <Pagination
            count={paginationCount}
            onChange={(_e: React.ChangeEvent<unknown>, page: number) => {
              callProductsPage(page.toString());
            }}
            variant="outlined"
          />
        )}
      </Box>
      <Footer />
    </>
  );
}

export default AllProducts;
