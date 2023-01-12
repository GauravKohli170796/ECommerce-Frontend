import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Button, Chip, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/productServices";
import CarouselProvider from '../carousel/CarouselProvider';

function ProductDetail() {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState<any | {}>({});
  const priceWithoutDiscount: number = (productDetail?.price / (1 - (productDetail?.discount / 100))) || productDetail?.price;

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      if (!id) {
        return;
      }
      let { data } = await getProductById(id);
      console.log(data);
      setProductDetail(data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderProductImages = () => {
    if (productDetail.images) {
      return <CarouselProvider imagesArr={productDetail && productDetail.images} showIndicators={true} />
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
    {Object.keys(productDetail).length > 1 && <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
      <Box sx={{ width: { sm: "95vw", md: "45vw" }, marginY: "16px",alignSelf: "flex-start", justifyContent: "flex-start",  }}>
        <Stack direction="column">
          {renderProductImages()}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" fullWidth>Buy now</Button>
              <Button variant="contained" fullWidth>Add to Cart</Button>
            </Stack>


        </Stack>
      </Box>
      <Divider sx={{ display: { xs: "block", md: "none", width: "100%" } }}></Divider>
      <Box sx={{ width: { sm: "95vw", md: "45vw" }, marginY: "16px", alignSelf: "flex-start", justifyContent: "flex-start", marginLeft: "16px" }}>
        <Stack spacing={2}>
          <Typography fontSize={24} className="leftText" variant="h5">{productDetail.name}</Typography>
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
    </Box>}
  </>;
}

export default ProductDetail;
