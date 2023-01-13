import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, Button, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAppState } from "../../AppContext";
import logo from "../../assets/images/logo.png";
import { drawerShowOptions } from "../../constants/AppConst";

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
  }, [AppState.authDetails]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogOut = () => {
    AppState.setAuthDetails(null);
  }

  const openDrawer = (showOption: drawerShowOptions) => {
    AppState.setOpenDrawer(true);
    AppState.setDrawerOption(showOption);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: "8px", position: "sticky", top: 0, left: 0, zIndex: 1000 }}>
      <AppBar position="static" className="mixBackground">
        <Toolbar>
          <img src={logo} height="80px" alt="Main logo"></img>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Tooltip title="Home" arrow>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => {
                  navigate("/product/showProducts");
                }}
                sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}
              >
                <HomeIcon />
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
              <IconButton aria-label="delete" size="small" sx={{ backgroundColor: "#9c27b0", color: "white", marginRight: "16px" }}>
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>
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
            <Button
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              {" "}
              <MenuIcon color="secondary" />
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/product/showProducts");
                }}
              >
                <IconButton sx={{ marginRight: "8px", backgroundColor: "#9c27b0", color: "white" }} size="small">
                  <HomeIcon />
                </IconButton>
                <Typography variant="body1" color="secondary">Home</Typography>
              </MenuItem>
              <Divider color="secondary" />
              <MenuItem
                onClick={() => {
                  handleClose();
                  openDrawer(drawerShowOptions.filter);
                }}
              >
                <IconButton sx={{ marginRight: "8px", backgroundColor: "#9c27b0", color: "white" }} size="small">
                  <FilterAltIcon />
                </IconButton>
                <Typography variant="body1" color="secondary">Filters</Typography>
              </MenuItem>
              <Divider color="secondary" />
              <MenuItem
                onClick={() => {
                  handleClose();
                  openDrawer(drawerShowOptions.search);
                }}
              >
                <IconButton sx={{ marginRight: "8px", backgroundColor: "#9c27b0", color: "white" }} size="small">
                  <SearchIcon />
                </IconButton>
                <Typography variant="body1" color="secondary">Search Products</Typography>
              </MenuItem>
              <Divider color="secondary" />
              <MenuItem onClick={handleClose}>
                <IconButton sx={{ marginRight: "8px", backgroundColor: "#9c27b0", color: "white" }} size="small">
                  <ShoppingCartIcon />
                </IconButton>
                <Typography variant="body1" color="secondary">My Cart</Typography>

              </MenuItem>
              <Divider color="secondary" />
              {isLoggedIn && <MenuItem onClick={handleClose}>
                <IconButton onClick={handleLogOut} sx={{ marginRight: "8px", backgroundColor: "#9c27b0", color: "white" }} size="small">
                  <LogoutIcon />
                </IconButton>
                <Typography variant="body1" color="secondary"> Log Out</Typography>

              </MenuItem>}

              {!isLoggedIn && <MenuItem onClick={handleClose}>
                <IconButton onClick={() => {
                  navigate("/auth/login");
                }} sx={{ marginRight: "8px", backgroundColor: "#9c27b0", color: "white" }} size="small">
                  <AccountBoxIcon />
                </IconButton>
                <Typography variant="body1" color="secondary">Login/SignUp</Typography>
              </MenuItem>
              }
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Header;
