import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Card, CardActions, CardContent, CardMedia, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../../models/productModel";

type IProp = {
  product: IProduct;
};
const useStyles = makeStyles({
  root: {
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.05, 1.03, 1.05)" },
  },
});


function ProductCard(prop: IProp) {
  const priceWithoutDiscount: number = (prop.product.price / (1 - (prop.product.discount / 100)));
  const classes = useStyles();

  return (
    <Link to={`/product/productDetail/${prop.product._id}`} style={{ textDecoration: "none" }}>
      <Paper elevation={5} sx={{margin:"5px"}}>
        <Card
          sx={{
            minWidth: 220,
            maxWidth: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

          }}
          className={classes.root}
        >
          <CardMedia
            component="img"
            alt="Product Image"
            height="260"
            image={(prop.product?.images && prop.product.images[0]) || "https://source.unsplash.com/720x600/?girl,clothes"}
          />
          <CardContent>
            <Typography gutterBottom variant="body1" component="div" sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}>
              {prop.product.name}
            </Typography>
            <Typography
              sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}
              variant="body2"
              color="text.secondary"
            >
              {prop.product.description}
            </Typography>
          </CardContent>
          <CardActions>
            <CurrencyRupeeIcon fontSize="small" />  {prop.product.price}
            <Typography sx={{ textDecoration: "line-through", marginX: "5px", color: "rgb(38, 165, 65)" }} variant="body2">
              {parseInt(priceWithoutDiscount.toString())}
            </Typography>
            <Typography sx={{ color: "rgb(38, 165, 65)" }} variant="body2">
              {`discount ${prop.product.discount}%`}
            </Typography>
          </CardActions>
        </Card>
      </Paper>
    </Link>
  );
}

export default ProductCard;
