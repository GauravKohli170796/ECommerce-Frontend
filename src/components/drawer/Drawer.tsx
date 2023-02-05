import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment, Slider,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { GetAppState } from "../../AppContext";
import logo from "../../assets/images/logo.png";
import { drawerShowOptions, filterInitailValue } from "../../constants/AppConst";

function Drawer() {
  const AppState = GetAppState();

  const handleRatingSort = (event: any) => {
    if (event.target.checked) {
      AppState.setFilters({ ...AppState.filters, ratingSort: event.target.value });
      return;
    }
    AppState.setFilters({ ...AppState.filters, ratingSort: "" });
  };

  const handlePrice = (event: any): void => {
    AppState.setFilters({ ...AppState.filters, price: event.target.value });
  };

  const handlePriceSort = (event: any): void => {
    if (event.target.checked) {
      AppState.setFilters({ ...AppState.filters, priceSort: event.target.value });
      return;
    }
    AppState.setFilters({ ...AppState.filters, priceSort: "" });
  };

  const handleCategory = (event: any): void => {
    const categoryValue = event.target.value.toString().toUpperCase();
    if (event.target.checked) {
      AppState.setFilters({ ...AppState.filters, categories: [...AppState.filters.categories, categoryValue] });
      return;
    }
    const categoryFilterVal = AppState.filters.categories((categoryVal: string) => categoryVal !== categoryValue);
    AppState.setFilters({ ...AppState.filters, categories: categoryFilterVal });
  };

  const renderSearchComponent = () => {
    return (
      <Box sx={{ width: "90%", margin: "20px 5px", display: "flex", flexDirection: "column" }}>
        <TextField
          color="secondary"
          focused
          id="outlined-basic"
          label="Search a product"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          fullWidth
        />
        <Button variant="contained" color="secondary" sx={{ alignSelf: "flex-end", marginTop: "20px" }}>
          Search
        </Button>
      </Box>
    );
  };


  const handleSliderInputs = (rangeValue:string,isLow=false) =>{
    const value = parseInt(rangeValue);
    if(isLow){
       if(value > AppState.filters.price[1]){
        return;
       }
      AppState.setFilters({...AppState.filters,price:[value,AppState.filters.price[1]]});
      return;
    };
    if(value < AppState.filters.price[0]){
      return;
     }
    AppState.setFilters({...AppState.filters,price:[AppState.filters.price[0],value]});
  };

  const renderCategoriesOptions = () => {
    return AppState.categories.map((category: string) => {
      return <FormControlLabel
        onChange={(e) => {
          handleCategory(e);
        }}
        control={<Checkbox />}
        label={category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
        value={category.toUpperCase()}
        checked={AppState.filters.categories?.includes(category.toUpperCase())}
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
          <Button variant="outlined" color="secondary" size="small" sx={{ alignSelf: "flex-end", marginTop: "20px" }} onClick={() => { AppState.setFilters(filterInitailValue) }}>
            Clear Filters
          </Button>
          <Button variant="outlined" color="primary" size="small" sx={{ alignSelf: "flex-end", marginTop: "20px" }} onClick={() => { AppState.setFilters(filterInitailValue) }}>
            Apply Filters
          </Button>
        </Stack>
        <Divider sx={{ marginY: "20px" }} />
        <Typography variant="h6">Price</Typography>
        <Slider
          getAriaLabel={() => "Minimum distance shift"}
          value={AppState.filters.price}
          valueLabelDisplay="auto"
          onChange={handlePrice}
          max={8000}
          color="secondary"
        />
        <Stack direction="row" spacing={4}>

          <TextField
            color="secondary"
            label="From"
            variant="outlined"
            size="small"
            type="number"
            value={AppState.filters.price[0]}
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
            value={AppState.filters.price[1]}
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
        <Typography variant="h6">Sort Price</Typography>
        <FormGroup>
          <FormControlLabel
            onChange={(e) => {
              handlePriceSort(e);
            }}
            control={<Checkbox />}
            value="PriceLowToHigh"
            checked={AppState.filters.priceSort === "PriceLowToHigh"}
            label="Price low to high"
          />
          <FormControlLabel
            onChange={(e) => {
              handlePriceSort(e);
            }}
            control={<Checkbox />}
            value="PriceHighToLow"
            checked={AppState.filters.priceSort === "PriceHighToLow"}
            label="Price high to low"
          />
        </FormGroup>
        <Divider sx={{ marginY: "20px" }} />
        <Typography variant="h6">Sort Rating</Typography>
        <FormGroup>
          <FormControlLabel
            onChange={(e) => {
              handleRatingSort(e);
            }}
            name="sortRating"
            control={<Checkbox />}
            checked={AppState.filters.ratingSort === "RatingLowToHigh"}
            value="RatingLowToHigh"
            label="Rating low to high"
          />
          <FormControlLabel
            onChange={(e) => {
              handleRatingSort(e);
            }}
            name="sortRating"
            control={<Checkbox />}
            checked={AppState.filters.ratingSort === "RatingHighToLow"}
            value="RatingHighToLow"
            label="Rating high to low"
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
      }}
      onOpen={() => {
        AppState?.setOpenDrawer(true);
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", width: { xs: "75vw", md: "25vw" } }}>
        <img src={logo} height="60px" style={{ margin: "30px 0px 30px 0px" }} alt="Website Logo" />
        <Divider />
        {AppState?.drawerOption === drawerShowOptions.filter && renderFliterComponent()}
        {AppState?.drawerOption === drawerShowOptions.search && renderSearchComponent()}
      </Box>
    </SwipeableDrawer>
  );
}
export default Drawer;
