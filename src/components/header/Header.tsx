import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, IconButton, SpeedDial, SpeedDialAction, Toolbar, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import logo from "../../assets/images/logo.png";
import { drawerShowOptions } from "../../constants/AppConst";
import BottomNav from "../bottomNavigation/BottomNav";


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  }

  const openDrawer = (showOption: drawerShowOptions) => {
    AppState?.setOpenDrawer(true);
    AppState?.setDrawerOption(showOption);
  }

  return (
    <>
    <Box sx={{ flexGrow: 1, marginBottom: "8px", position: "fixed", top: 0, left: 0,right:0, zIndex: 1000}}>
      <AppBar position="static" className="mixBackground">
        <Toolbar>
          <img style={{padding:"16px"}} src={logo} onClick={()=> navigate("/product/showProducts")} height="55px" alt="Main logo"></img> 
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Tooltip title="Shop" arrow>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => {
                  navigate("/product/showProducts");
                }}
                sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}
              >
                <ShoppingBagIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filters" arrow>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => {
                  openDrawer(drawerShowOptions.filter);
                }}
                sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}
              >
                <FilterAltIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Search Products" arrow>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => {
                  openDrawer(drawerShowOptions.search);
                }}
                sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="My Cart" arrow>
              <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }} onClick={() => {
                  navigate("/user/shoppingCart");
                }}>
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="My WishList" arrow>
              <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }} onClick={() => {
                  navigate("/user/wishList");
                }}>
                <FavoriteIcon />
              </IconButton>
            </Tooltip>

            {isLoggedIn && <Tooltip title="Admin Controller" arrow>
              <IconButton onClick={() => {
                navigate('/admin/adminController');
              }} aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}>
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>}

            {isLoggedIn && <Tooltip title="Logut" arrow>
              <IconButton onClick={handleLogOut} aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>}

            {!isLoggedIn && <Tooltip title="Login/Signup" arrow>
              <IconButton onClick={() => {
                navigate("/auth/login");
              }} aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}>
                <LoginIcon />
              </IconButton>
            </Tooltip>}
          </Box>

          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <BottomNav />
            <SpeedDial
              direction="down"
              ariaLabel="SpeedDial basic example"
              sx={{ position: 'fixed', top: 12, right: 16}}
              icon={<MenuIcon/>}
              FabProps={{
                sx: {
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.main',
                  }
                }
              }}
            >
               <SpeedDialAction
                tooltipOpen
                key="Admin Panel"
                icon={<AdminPanelSettingsIcon />}
                tooltipTitle="Admin"
                onClick={() => {
                  navigate("/admin/admincontroller");
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />

               <SpeedDialAction
                tooltipOpen
                key=" My Wishlist"
                icon={<FavoriteIcon/>}
                tooltipTitle="Wishlist"
                onClick={() => {
                  navigate("/user/wishList");
                }}
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />

              {!isLoggedIn && <SpeedDialAction
                tooltipOpen
                key="Login/SignUp"
                icon={<AccountBoxIcon/>}
                tooltipTitle="Login"
                onClick={() => {
                  navigate("/auth/login");
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
                icon={<LogoutIcon/>}
                onClick={() => {
                  handleLogOut();
                }}
                tooltipTitle="Logout"
                FabProps={{
                  sx: {
                    bgcolor: 'secondary.main',
                    color: "white"
                  }
                }}
              />}
            </SpeedDial>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    <Box className="headerMargin"></Box>
    </>
  );
}
export default Header;
