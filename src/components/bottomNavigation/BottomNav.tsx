import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { BottomNavigation, Button, Paper, Typography } from '@mui/material';
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/material/styles";
import { Box, Stack } from '@mui/system';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import { drawerShowOptions, filterInitailValue } from "../../constants/AppConst";

function BottomNav() {
  const sound = new Audio("/clickSound.mp3");
  const [value, setValue] = React.useState('Shop');
  const navigate = useNavigate();
  const AppState = GetAppState();

  const openDrawer = (showOption: drawerShowOptions) => {
    AppState?.setOpenDrawer(true);
    AppState?.setDrawerOption(showOption);
  };

  const playSound = ()=>{
    sound.play();
  }

  const showAlertMessage = ()=>{
    confirmAlert({
      customUI: ({ onClose }) => {
          return (
              <Paper elevation={10}>
                  <Box className="fCol fCenter my-2" sx={{ padding: "32px"}}>
                      <Typography variant="body2">To Use Cart or Wishist. Use need to Login First.</Typography>
                      <Stack direction="row" spacing={2}>
                          <Button size="small" onClick={() => {
                              onClose();
                              navigate("/auth/login")
                          }} color="primary" variant="contained">Log In</Button>
                          <Button size="small" onClick={() => {
                              onClose();
                          }} color="primary" variant="contained">Close</Button>
                      </Stack>
                  </Box>
              </Paper>
          );
      }
  });
  };

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
