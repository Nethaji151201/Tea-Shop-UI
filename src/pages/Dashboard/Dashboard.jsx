import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import api from "../../services/api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

// Returns a date string in "YYYY-MM-DD" format
const toDateStr = (date) => date.toISOString().split("T")[0];

const getDefaultDates = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return {
    fromDate: toDateStr(lastMonth),
    toDate: toDateStr(today),
  };
};

const Dashboard = () => {
  const defaultDates = getDefaultDates();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(defaultDates.fromDate);
  const [toDate, setToDate] = useState(defaultDates.toDate);

  const fetchDashboardData = async (pFromDate, pToDate) => {
    setLoading(true);
    try {
      const response = await api.post("/dashboard", {
        from_date: pFromDate,
        to_date: pToDate,
      });
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(defaultDates.fromDate, defaultDates.toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    fetchDashboardData(fromDate, toDate);
  };

  const summaryCards = [
    {
      title: "Total Sales",
      value: `₹ ${(stats.totalSales || 0).toFixed(2)}`,
      icon: <AttachMoneyIcon fontSize="large" />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: <ShoppingBagIcon fontSize="large" />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts || 0,
      icon: <StorefrontIcon fontSize="large" />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <PeopleIcon fontSize="large" />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <Box className="animate-fade-in fade-in-up">
      {/* Header */}
      <Box className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <Typography variant="h5" className="font-bold text-gray-800">
            Dashboard Overview
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Key performance metrics and summary statistics.
          </Typography>
        </div>

        {/* Date Range Filter */}
        <Box className="flex flex-wrap items-center gap-3">
          <TextField
            label="From Date"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: toDate }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            label="To Date"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: fromDate }}
            sx={{ minWidth: 160 }}
          />
          <Button
            variant="contained"
            size="medium"
            startIcon={<FilterAltIcon />}
            onClick={handleApply}
            disabled={loading}
            sx={{
              backgroundColor: "#059669",
              "&:hover": { backgroundColor: "#047857" },
              textTransform: "capitalize",
              boxShadow: "none",
              borderRadius: "8px",
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      {loading ? (
        <Box className="flex justify-center items-center h-48">
          <CircularProgress sx={{ color: "#f59e0b" }} />
        </Box>
      ) : (
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
      )}

      {/* Recent Activity placeholder */}
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
