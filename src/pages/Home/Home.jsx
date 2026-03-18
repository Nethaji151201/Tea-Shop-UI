import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Typography, Grid, Paper, Box } from "@mui/material";

// Icons mapping based on typical menu names
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import StorefrontIcon from "@mui/icons-material/Storefront";

const iconMap = {
  "/billing": <PointOfSaleIcon className="text-4xl" />,
  "/dashboard": <DashboardIcon className="text-4xl" />,
  "/product": <InventoryIcon className="text-4xl" />,
  "/users": <GroupIcon className="text-4xl" />,
  "/home": <StorefrontIcon className="text-4xl" />,
  default: <StorefrontIcon className="text-4xl" />,
};

const getMenuDescription = (path) => {
  const descriptions = {
    "/billing": "Create orders and calculate totals.",
    "/dashboard": "View real-time sales metrics and analytics.",
    "/product": "Manage inventory, add or remove tea varieties.",
    "/users": "Manage system users and their roles.",
    "/home": "Main navigation hub.",
  };
  return descriptions[path] || "Access this section.";
};

const Home = () => {
  const { user, menus } = useAuth();
  const navigate = useNavigate();

  return (
    <Box className="animate-fade-in fade-in-up">
      <div className="mb-8">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 tracking-tight"
        >
          Welcome back, {user?.fullname || "User"}! 👋
        </Typography>
        <Typography variant="subtitle1" className="text-gray-500 mt-1">
          Select a module below to get started.
        </Typography>
      </div>

      <Grid container spacing={4}>
        {menus
          ?.filter((m) => m.path !== "/home")
          .map((menu, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                elevation={0}
                onClick={() => navigate(menu.path)}
                className="p-6 h-full rounded-2xl cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <Box className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {iconMap[menu.path] || iconMap["default"]}
                  </div>
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors"
                  >
                    {menu.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-500 flex-grow"
                  >
                    {getMenuDescription(menu.path)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Home;
