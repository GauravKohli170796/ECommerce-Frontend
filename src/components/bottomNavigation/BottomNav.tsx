import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { BottomNavigation } from '@mui/material';
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/material/styles";
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import { drawerShowOptions } from "../../constants/AppConst";



function BottomNav() {
  const [value, setValue] = React.useState('Shop');
  const [pathName, setPathName] = React.useState('');
  const navigate = useNavigate();
  const location =useLocation();
  const AppState = GetAppState();


  useEffect(()=>{
    setPathName(location.pathname);
  },[navigate])


  const openDrawer = (showOption: drawerShowOptions) => {
    AppState?.setOpenDrawer(true);
    AppState?.setDrawerOption(showOption);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  const BottomNavigationAction = styled(MuiBottomNavigationAction)
    (`
      color: white;
      &.Mui-selected {
        color: whitesmoke;
      }
    `);
  return (
    <>
      <BottomNavigation showLabels className="mixBackground py-0 px-0" sx={{display:"flex",flexWrap:"wrap",height:"fit-content",paddingY:"8px",width: "100%", position: "fixed", bottom: 0, left: 0}} value={value} onChange={handleChange}>
        {pathName!=='/product/showProducts' && <BottomNavigationAction
          label="Shop"
          value="Shop"
          sx={{minWidth:"71px"}}
          icon={<ShoppingBagIcon />}
          onClick={() => {
            navigate("/product/showProducts");
          }}
        />}
        <BottomNavigationAction
          label="Filters"
          value="Filters"
          sx={{minWidth:"71px"}}
          icon={<FilterAltIcon />}
          onClick={() => {
            openDrawer(drawerShowOptions.filter);
          }}
        />
        <BottomNavigationAction
          label="Search"
          value="Search"
          sx={{minWidth:"71px"}}
          icon={<SearchIcon />}
          onClick={() => {
            openDrawer(drawerShowOptions.search);
          }}
        />

        {pathName!=='/user/shoppingCart' && <BottomNavigationAction
          label="Cart"
          value="Cart"
          sx={{minWidth:"71px"}}
          onClick={() => {
            navigate("/user/shoppingCart");
          }}
          icon={<ShoppingCartIcon />}
        />}

        {pathName!=='/user/wishList' && <BottomNavigationAction
          label="Wishlist"
          sx={{minWidth:"71px"}}
          value="Wishlist"
          onClick={() => {
            navigate("/user/wishList");
          }}
          icon={<FavoriteIcon />}
        />}

      </BottomNavigation>

    </>
  )
}

export default BottomNav;
