import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { BottomNavigation } from '@mui/material';
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/material/styles";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import { drawerShowOptions, filterInitailValue } from "../../constants/AppConst";
import useLogInPopup from '../../hooks/useLogInPopup';

function BottomNav() {
  const sound = new Audio("/clickSound.mp3");
  const [value, setValue] = React.useState('Shop');
  const navigate = useNavigate();
  const AppState = GetAppState();
  const showAlertMessage = useLogInPopup();

  const openDrawer = (showOption: drawerShowOptions) => {
    AppState?.setOpenDrawer(true);
    AppState?.setDrawerOption(showOption);
  };

  const playSound = ()=>{
    sound.play();
  }

  const navigatetoPage = (urlPath: string)=>{
    const auth = localStorage.getItem("auth");
    if(!auth){
      showAlertMessage();
      return;
    }
       navigate(urlPath);
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
        <BottomNavigationAction
          label="Shop"
          value="Shop"
          sx={{minWidth:"71px"}}
          icon={<ShoppingBagIcon />}
          onClick={() => {
            playSound();
            AppState.setFilters(filterInitailValue);
            navigate("/product/showProducts");
          }}
        />
        <BottomNavigationAction
          label="Filters"
          value="Filters"
          sx={{minWidth:"71px"}}
          icon={<FilterAltIcon />}
          onClick={() => {
            openDrawer(drawerShowOptions.filter);
            playSound();
          }}
        />
        

         <BottomNavigationAction
          label="Cart"
          value="Cart"
          sx={{minWidth:"71px"}}
          onClick={() => {
            playSound();
            navigatetoPage("/user/shoppingCart");
          }}
          icon={<ShoppingCartIcon />}
        />

        <BottomNavigationAction
          label="Wishlist"
          sx={{minWidth:"71px"}}
          value="Wishlist"
          onClick={() => {
            playSound();
            navigatetoPage("/user/wishList");
          }}
          icon={<FavoriteIcon />}
        />

      </BottomNavigation>

    </>
  )
}

export default BottomNav;
