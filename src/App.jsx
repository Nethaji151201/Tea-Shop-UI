import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import MainLayout from "./layouts/MainLayout";
import { ROUTES } from "./utils/constants";
import { CircularProgress, Box } from "@mui/material";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login/Login"));
const Home = lazy(() => import("./pages/Home/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Users = lazy(() => import("./pages/Users/Users"));
const Product = lazy(() => import("./pages/Product/Product"));
const Billing = lazy(() => import("./pages/Billing/Billing"));

const LoadingFallback = () => (
  <Box className="w-full h-screen flex items-center justify-center bg-slate-50">
    <CircularProgress size={40} className="text-amber-500" />
  </Box>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? ROUTES.HOME : ROUTES.LOGIN} replace />}
        />

        {/* Public Route */}
        <Route
          path={ROUTES.LOGIN}
          element={!user ? <Login /> : <Navigate to={ROUTES.HOME} replace />}
        />

        {/* Protected Routes inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.USERS} element={<Users />} />
          <Route path={ROUTES.PRODUCT} element={<Product />} />
          <Route path={ROUTES.BILLING} element={<Billing />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
