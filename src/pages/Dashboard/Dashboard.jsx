import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, CircularProgress } from "@mui/material";
import api from "../../services/api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fallback to fetch items individually to calculate stats since backend might not have /dashboard endpoint yet
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get("/products").catch(() => ({ data: [] })),
          api.get("/users").catch(() => ({ data: [] })),
          api.get("/orders").catch(() => ({ data: [] })),
        ]);

        const productsCount = Array.isArray(productsRes.data)
          ? productsRes.data.length
          : 0;
        const usersCount = Array.isArray(usersRes.data)
          ? usersRes.data.length
          : 0;
        const ordersList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const ordersCount = ordersList.length;

        // Calculate total sales from orders
        const totalSalesAmt = ordersList.reduce(
          (acc, order) => acc + (order.total_amount || 0),
          0,
        );

        setStats({
          totalSales: totalSalesAmt,
          totalOrders: ordersCount,
          totalProducts: productsCount,
          totalUsers: usersCount,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const summaryCards = [
    {
      title: "Total Sales",
      value: `₹ ${stats.totalSales.toFixed(2)}`,
      icon: <AttachMoneyIcon fontSize="large" />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBagIcon fontSize="large" />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <StorefrontIcon fontSize="large" />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress className="text-amber-500" />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in fade-in-up">
      <div className="mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          Dashboard Overview
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Key performance metrics and summary statistics.
        </Typography>
      </div>

      <Grid container spacing={4}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              className="p-6 rounded-2xl flex items-center justify-between border border-gray-100 hover:shadow-lg transition-shadow bg-white"
            >
              <Box>
                <Typography
                  variant="body2"
                  className="text-gray-500 font-medium mb-1 uppercase tracking-wide"
                >
                  {card.title}
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {card.value}
                </Typography>
              </Box>
              <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Additional dashboard content could go here (charts, recent orders, etc.) */}
      <Box className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hidden md:block">
        <Typography variant="h6" className="font-bold text-gray-800 mb-4">
          Recent Activity
        </Typography>
        <Typography variant="body2" className="text-gray-400 italic">
          Charts and detailed activity logs can be integrated here.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
