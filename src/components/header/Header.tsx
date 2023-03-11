import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import logo from "../../assets/images/logo.png";
import { AppConst, drawerShowOptions, filterInitailValue } from "../../constants/AppConst";
import BottomNav from "../bottomNavigation/BottomNav";


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sound = new Audio("/clickSound.mp3");
  const navigate = useNavigate();
  const AppState = GetAppState();

  useEffect(() => {
    async function checkLogInStatus() {
      const authToken = await localStorage.getItem("auth");
      if (authToken) {
        setIsLoggedIn(true);
      }
    }
    checkLogInStatus();
  }, [navigate]);

  const handleLogOut = async () => {
    await localStorage.removeItem("auth");
    await sessionStorage.clear();
    AppState?.setAuthDetails(null);
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
    window.location.reload();

  }

  const playSound = ()=>{
    sound.play();
  }

  const openDrawer = (showOption: drawerShowOptions) => {
    AppState?.setOpenDrawer(true);
    AppState?.setDrawerOption(showOption);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: "8px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <AppBar position="static" className="mixBackground">
          <Toolbar>
            <img style={{ padding: "16px" }} src={logo} onClick={() => { AppState.setFilters(filterInitailValue);navigate("/product/showProducts")}} height="55px" alt="Main logo"></img>
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
                    openDrawer(drawerShowOptions.filter);
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
                    openDrawer(drawerShowOptions.search);
                  }}
                  sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white" }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="My Cart" arrow>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", display: { xs: "none", sm: "Inherit" } }} onClick={() => {
                  playSound();
                  navigate("/user/shoppingCart");
                }}>
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="My WishList" arrow>
                <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", display: { xs: "none", sm: "Inherit" } }} onClick={() => {
                 playSound();
                 navigate("/user/wishList");
                }}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>

              {isLoggedIn && <Tooltip title="Admin Controller" arrow>
                <IconButton onClick={() => {
                  playSound();
                  navigate('/admin/adminController');
                }} aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white", }}>
                  <AdminPanelSettingsIcon />
                </IconButton>
              </Tooltip>}

              {!AppConst.PathLogoutNotShown.includes(window.location.pathname) && isLoggedIn && <Tooltip title="Logut" arrow>
                <IconButton onClick={()=>{handleLogOut();playSound()}} aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white" }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>}

              {!isLoggedIn && <Tooltip title="Login/Signup" arrow>
                <IconButton onClick={() => {
                  playSound();
                  navigate("/auth/login");
                }} aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", padding: "8px", color: "white" }}>
                  <LoginIcon />
                </IconButton>
              </Tooltip>}
            </Box>

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
