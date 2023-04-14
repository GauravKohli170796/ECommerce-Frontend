import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, IconButton, SpeedDial, SpeedDialAction, Toolbar, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import jwt from 'jwt-decode';
import React, { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import logo from "../../assets/images/logo.png";
import { AppConst, drawerShowOptions, filterInitailValue } from "../../constants/AppConst";
import useLogInPopup from '../../hooks/useLogInPopup';
import { IUserDetails, eRole } from '../../models/authModels';
import BottomNav from "../bottomNavigation/BottomNav";


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin , setIsAdmin] = useState(false);
  const sound = new Audio("/clickSound.mp3");
  const navigate = useNavigate();
  const AppState = GetAppState();
  const showAlertMessage = useLogInPopup();

  useEffect(() => {
    async function checkLogInStatus() {
      const accessToken = await localStorage.getItem(AppConst.storageKeys.accessToken);
      if (accessToken) {
        const userDetails:IUserDetails = jwt<IUserDetails>(accessToken);
        if(userDetails?.role === eRole.Admin){
          setIsAdmin(true);
        }
        setIsLoggedIn(true);
      }
    }
    checkLogInStatus();
  }, [navigate]);

  const handleLogOut = async () => {
    await localStorage.removeItem(AppConst.storageKeys.accessToken);
    await localStorage.removeItem(AppConst.storageKeys.refreshToken);
    await sessionStorage.clear();
    AppState?.setCartList(null);
    AppState?.setWishList(null);
    Store.addNotification({
      message: "Successfully logged out.",
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    });
    setIsLoggedIn(false);
    navigate("/product/showProducts")
  }

  const navigatetoPage = (urlPath: string) => {
    const auth = localStorage.getItem(AppConst.storageKeys.accessToken);
    if (!auth) {
      showAlertMessage();
      return;
    }
    navigate(urlPath);
  };

  const playSound = () => {
    sound.play();
  }

  const openDrawer = (showOption: drawerShowOptions) => {
    AppState?.setOpenDrawer(true);
    AppState?.setDrawerOption(showOption);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: "8px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <AppBar position="static" className="mixBackground" sx={{maxHeight:"90px"}}>
          <Toolbar>
            <img style={{ padding: "16px" }} src={logo} onClick={() => { AppState.setFilters(filterInitailValue); navigate("/product/showProducts") }} height="55px" alt="Main logo"></img>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
            <Box sx={{ display: "flex", flexDirection: "row", columnGap: "16px" }}>
              <Tooltip title="Shop" arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => {
                    AppState.setFilters(filterInitailValue);
                    playSound();
                    navigate("/product/showProducts");
                  }}
                  sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", display: { xs: "none", sm: "Inherit" } }}
                >
                  <ShoppingBagIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filters" arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => {
                    playSound();
                    openDrawer(drawerShowOptions.FILTER);
                  }}
                  sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", display: { xs: "none", sm: "Inherit" } }}
                >
                  <FilterAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Search Products" arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => {
                    playSound();
                    openDrawer(drawerShowOptions.SEARCH);
                  }}
                  sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white" }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="My Cart" arrow>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", display: { xs: "none", sm: "Inherit" } }} onClick={() => {
                  playSound();
                  navigatetoPage("/user/shoppingCart");
                }}>
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="My WishList" arrow>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", display: { xs: "none", sm: "Inherit" } }} onClick={() => {
                  playSound();
                  navigatetoPage("/user/wishList");
                }}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>

            </Box>
            <SpeedDial
              direction="down"
              ariaLabel="SpeedDial basic example"
              sx={{ '& .MuiFab-primary': { width: 40, height: 40 },marginLeft:"8px",marginTop: isLoggedIn ? (isAdmin ? "238px" : "182px"):"70px"}}
              icon={<MenuIcon />}
              FabProps={{
                sx: {
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.main',
                  }
                }
              }}
            >
              {isLoggedIn &&<SpeedDialAction
                tooltipOpen
                key=" My Orders"
                icon={<ShoppingBagIcon />}
                tooltipTitle="My Orders"
                onClick={() => {
                  playSound();
                  navigate("/orders/my-orders");
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />}
              {isLoggedIn &&<SpeedDialAction
                tooltipOpen
                key=" My Address"
                icon={<HomeIcon />}
                tooltipTitle="My Address"
                onClick={() => {
                  playSound();
                  navigate("/manage-address",{state: {renderAsOrder: false}});
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />}
              {isLoggedIn && isAdmin &&<SpeedDialAction
                tooltipOpen
                key="Admin Panel"
                icon={<AdminPanelSettingsIcon />}
                tooltipTitle="Admin Panel"
                onClick={() => {
                  playSound();
                  navigate("/admin/admincontroller");
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />}
             {isLoggedIn && <SpeedDialAction
                tooltipOpen
                key="Logout"
                icon={<LogoutIcon />}
                tooltipTitle="Logout"
                onClick={() => {
                  playSound();
                  handleLogOut(); 
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />}
              {!isLoggedIn && <SpeedDialAction
                tooltipOpen
                key="Login"
                icon={<LoginIcon />}
                tooltipTitle="Login"
                onClick={() => {
                  playSound();
                  navigate("/auth/login");
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />}
            </SpeedDial>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <BottomNav />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box className="headerMargin"></Box>
    </>
  );
}
export default Header;
