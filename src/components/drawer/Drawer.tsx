import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment, Stack,
  SwipeableDrawer,
  TextField,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import logo from "../../assets/images/logo.png";
import { drawerShowOptions, filterInitailValue, notificationType } from "../../constants/AppConst";
import { IFilters } from "../../models/commanModel";
import { ISearchresult } from "../../models/productModel";
import { showNotificationMsg } from "../../services/createNotification";
import { searchProducts } from "../../services/productServices";

const useStyles = makeStyles({
  root: {
    transition: "transform 0.15s ease-in-out",
    "&:hover": { transform: "scale3d(1.05, 1.03, 1.05)" },
  },
});

function Drawer() {
  const AppState = GetAppState();
  const navigation = useNavigate();
  const [filters,setFilters] = useState<IFilters>(filterInitailValue);
  const [searchedProducts,setSearchProducts]= useState<ISearchresult[]>([]);
  let searchInterval:ReturnType<typeof setTimeout>;
  const classes = useStyles();
  const handleSortOptions = (event: any): void => {
    if (event.target.checked) {
      setFilters({ ...filters,priceSort:false,ratingSort:false,discountSort:false, [event.target.value]: true });
      return;
    }
    setFilters({ ...filters, [event.target.value]: false });
  };

  const handleCategory = (event: any): void => {
    console.log(event.target.value,event.target.checked);
    const categoryValue = event.target.value.toString().toUpperCase();
    if (event.target.checked) {
      setFilters({ ...filters, categories: [...filters.categories, categoryValue] });
      return;
    }
    const categoryFilterVal = filters.categories.filter((categoryVal: string) => categoryVal !== categoryValue);
    setFilters({ ...filters, categories: categoryFilterVal });
  };

  const openProduct = (productId: string)=>{
    setSearchProducts([]);
    AppState?.setOpenDrawer(false);
   navigation(`/product/productDetail/${productId}`);
  };

  const renderSearchComponent = () => {
    return (
      <>
      <Box sx={{ width: "90%", margin: "20px 5px", display: "flex", flexDirection: "column" }}>
        <TextField
          color="secondary"
          focused
          id="outlined-basic"
          label="Search a product"
          variant="outlined"
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          fullWidth
        />
      </Box>
      {searchedProducts.length>0 && searchedProducts.map((searchProduct: ISearchresult)=>{
          return <Box onClick={()=>{openProduct(searchProduct._id)}} key={searchProduct._id}  className="my-2 fullWidth p-1" sx={{border:".1px solid lightgrey",marginLeft:"16px",overflowX:"clip"}}>
          <Stack className={classes.root} direction="row" spacing={2} >
             <img src={searchProduct.images[0]} alt="product" height="80" width="80" style={{objectFit:"cover"}}></img>
             <Stack sx={{width:"100%"}}>
              <Typography>{searchProduct.name}</Typography>
              <Typography
              sx={{ textOverflow: "ellipsis", width: "99%", overflow: "hidden", whiteSpace: "nowrap", textAlign: "left" }}
              variant="body2"
              color="text.secondary"
            >
              {searchProduct.description}
            </Typography>
              <Typography sx={{ color: "rgb(38, 165, 65)" }} variant="body2">Price : {searchProduct.price} Rs</Typography>
             </Stack>
          </Stack>
          </Box>
        })
      }
      </>
    );
  };

  const handleSearch =async (event:React.ChangeEvent<HTMLInputElement>)=>{
     clearTimeout(searchInterval);
      searchInterval = setTimeout(()=>{
        if(event.target.value){
          searchProduct(event.target.value);
          return;
        }
        setSearchProducts([]);
      },800)
  };

  const searchProduct = async(searchStr: string)=>{
    const searchString = searchStr.trim();
    const {data} = await searchProducts(searchString);
    if(data.length ===0){
      setSearchProducts([]);
      showNotificationMsg("No product found. Try something different.", notificationType.INFO);
      return;
    }
    setSearchProducts(data);
    
  };

  const handleSliderInputs = (rangeValue:string,isLow=false) =>{
    const value = parseInt(rangeValue);
    if(isLow){
      setFilters({...filters,price:[value,filters.price[1]]});
      return;
    };
    setFilters({...filters,price:[filters.price[0],value]});
  };

  const getFilteredProducts= ()=>{
    const Appfilters = Object.assign({},filters);
    AppState.setFilters(Appfilters);
    navigation("/product/showProducts")
    AppState?.setOpenDrawer(false);
  }

  const renderCategoriesOptions = () => {
    return AppState.categories.map((category: string) => {
      return <FormControlLabel
        onChange={(e) => {
          handleCategory(e);
        }}
        control={<Checkbox />}
        label={category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
        value={category.toUpperCase()}
        checked={filters.categories?.includes(category.toUpperCase())}
        key={category}
      />
    })
  }
  const renderFliterComponent = () => {
    return (
      <Box sx={{ width: "86%", margin: "5px 5px", display: "flex", flexDirection: "column" }}>
        <Typography className="section-head" sx={{ fontSize: "20px" }}>
          Filters
        </Typography>
        <Stack direction="row" className="fCenter fRow">
          <Button variant="outlined" color="secondary" size="small" sx={{ alignSelf: "flex-end", marginTop: "20px" }} onClick={() => { AppState.setFilters(filterInitailValue);setFilters(filterInitailValue) }}>
            Clear Filters
          </Button>
          <Button variant="outlined" color="primary" size="small" sx={{ alignSelf: "flex-end", marginTop: "20px" }} onClick={getFilteredProducts}>
            Apply Filters
          </Button>
        </Stack>
        <Divider sx={{ marginY: "20px" }} />
        <Typography variant="h6" sx={{marginBottom:"16px"}}>Price</Typography>
        <Stack direction="row" spacing={4}>

          <TextField
            color="secondary"
            label="From"
            variant="outlined"
            size="small"
            type="number"
            value={filters.price[0]}
            onChange={(e)=>{handleSliderInputs(e.target.value,true)}}
            fullWidth
            InputProps={{
              inputProps: { 
                  max: 100, min: 10 
              }
          }}
          />
          <TextField
            color="secondary"
            label="To"
            variant="outlined"
            size="small"
            type="number"
            value={filters.price[1]}
            fullWidth
            InputProps={{ inputProps: { min: 0, max: 8000 } }}
            onChange={(e)=>{handleSliderInputs(e.target.value)}}
          />
        </Stack>
        <Divider sx={{ marginY: "12px" }} />
        <Typography variant="h6">Categories</Typography>
        <FormGroup>
          {renderCategoriesOptions()}
        </FormGroup>
        <Divider sx={{ marginY: "20px" }} />
        <Typography variant="h6">Sort</Typography>
        <FormGroup>
          <FormControlLabel
            onChange={(e) => {
              handleSortOptions(e);
            }}
            control={<Checkbox />}
            value="priceSort"
            checked={filters.priceSort === true}
            label="Price low to high"
          />
          <FormControlLabel
            onChange={(e) => {
              handleSortOptions(e);
            }}
            control={<Checkbox />}
            value="ratingSort"
            checked={filters.ratingSort === true}
            label="Rating high to low"
          />
          <FormControlLabel
            onChange={(e) => {
              handleSortOptions(e);
            }}
            control={<Checkbox />}
            value="discountSort"
            checked={filters.discountSort === true}
            label="Discount high to low"
          />
        </FormGroup>
      </Box>
    );
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={AppState?.openDrawer}
      onClose={() => {
        AppState?.setOpenDrawer(false);
        setSearchProducts([]);
      }}
      onOpen={() => {
        AppState?.setOpenDrawer(true);
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column",overflowX:"clip", width: { xs: "75vw", md: "25vw" } }}>
        <img src={logo} height="60px" style={{ margin: "30px 0px 30px 0px" }} alt="Website Logo" />
        <Divider />
        {AppState?.drawerOption === drawerShowOptions.filter && renderFliterComponent()}
        {AppState?.drawerOption === drawerShowOptions.search && renderSearchComponent()}
      </Box>
    </SwipeableDrawer>
  );
}
export default Drawer;
