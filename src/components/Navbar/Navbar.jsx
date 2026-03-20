import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const { user, menus, logout, broker } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      className="bg-white border-b border-gray-200"
    >
      <Toolbar className="max-w-7xl w-full mx-auto justify-between bg-white text-gray-800">
        {/* Brand */}
        <Box
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
            <img src={broker?.logo} alt="logo" />
          </div>
          <Typography
            variant="h6"
            className="font-bold text-gray-800 hidden sm:block"
          >
            {broker?.broker_name}
          </Typography>
        </Box>

        {/* Dynamic Nav Links */}
        <Box className="flex items-center gap-1 sm:gap-4 hidden md:flex">
          {menus.map((menu, index) => {
            const isActive = location.pathname.startsWith(menu.path);
            return (
              <Button
                key={index}
                component={Link}
                to={menu.path}
                className={`capitalize font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {menu.name}
              </Button>
            );
          })}
        </Box>

        {/* User Profile */}
        <Box className="flex items-center gap-3">
          <Typography
            variant="body2"
            className="text-gray-600 font-medium hidden sm:block"
          >
            Hi, {user?.fullname || "User"}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            className="hover:bg-gray-100"
          >
            <Avatar className="bg-amber-100 text-amber-700 w-9 h-9">
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              className: "mt-2 shadow-lg rounded-xl border border-gray-100",
            }}
          >
            <MenuItem disabled className="md:hidden">
              <Typography
                variant="body2"
                className="font-semibold text-gray-800"
              >
                Hi, {user?.fullname || "User"}
              </Typography>
            </MenuItem>

            {/* Mobile menu items */}
            <div className="md:hidden border-b border-gray-100 mb-1 pb-1">
              {menus.map((menu, index) => (
                <MenuItem
                  key={index}
                  component={Link}
                  to={menu.path}
                  onClick={handleMenuClose}
                  selected={location.pathname.startsWith(menu.path)}
                >
                  {menu.name}
                </MenuItem>
              ))}
            </div>

            <MenuItem
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogoutIcon fontSize="small" className="mr-2" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
