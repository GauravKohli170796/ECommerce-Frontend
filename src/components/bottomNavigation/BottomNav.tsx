import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { BottomNavigation } from '@mui/material';
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/material/styles";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import { drawerShowOptions } from "../../constants/AppConst";


function BottomNav() {
  const [value, setValue] = React.useState('recents');
  const navigate = useNavigate();
  const AppState = GetAppState();


  const openDrawer = (showOption: drawerShowOptions) => {
    AppState.setOpenDrawer(true);
    AppState.setDrawerOption(showOption);
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
      <BottomNavigation showLabels className="mixBackground py-0 px-0" sx={{ width: "100%", position: "fixed", bottom: 0, left: 0 }} value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Shop"
          value="Shop"
          icon={<ShoppingBagIcon />}
          onClick={() => {
            navigate("/product/showProducts");
          }}
        />
        <BottomNavigationAction
          label="Filters"
          value="Filters"
          icon={<FilterAltIcon />}
          onClick={() => {
            openDrawer(drawerShowOptions.filter);
          }}
        />
        <BottomNavigationAction
          label="Search"
          value="Search"
          icon={<SearchIcon />}
          onClick={() => {
            openDrawer(drawerShowOptions.search);
          }}
        />
        <BottomNavigationAction
          label="My Cart"
          value="Cart"
          onClick={() => {
            navigate("/user/shoppingCart");
          }}
          icon={<ShoppingCartIcon />}
        />


        {/* <BottomNavigationAction label="Account" value="Account" icon={<AccountBoxIcon />} /> */}
      </BottomNavigation>

    </>
  )
}

export default BottomNav;
