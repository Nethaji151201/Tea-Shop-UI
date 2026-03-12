import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
    if (result.success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <Container maxWidth="xs" className="relative z-10">
        <Paper
          elevation={0}
          className="p-8 pb-10 rounded-2xl shadow-xl shadow-amber-900/5 bg-white backdrop-blur-sm border border-white/50"
        >
          <Box className="flex flex-col items-center">
            <div className="bg-amber-100 text-amber-600 p-4 rounded-full mb-4 shadow-inner">
              <LocalCafeIcon fontSize="large" />
            </div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-1">
              Tea Shop POS
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-500 mb-8 text-center"
            >
              Enter your credentials to access your account
            </Typography>

            {error && (
              <Alert severity="error" className="w-full mb-4 rounded-lg">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="mt-6 mb-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all hover:shadow-lg disabled:bg-amber-300"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
