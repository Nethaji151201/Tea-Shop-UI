import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  IconButton,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const Billing = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // Selection states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Order states
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    // Check if item already in cart
    const existingIndex = cart.findIndex(
      (item) => item.product.id === selectedProduct.id,
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += parseInt(quantity, 10);
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        { product: selectedProduct, quantity: parseInt(quantity, 10) },
      ]);
    }

    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = parseInt(newQuantity, 10);
    setCart(newCart);
  };

  // Calculations
  const subTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [cart]);

  const discAmount = useMemo(() => {
    const d = parseFloat(discount) || 0;
    return subTotal * (d / 100);
  }, [subTotal, discount]);

  const grandTotal = useMemo(() => {
    return subTotal - discAmount;
  }, [subTotal, discAmount]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customerName || "Walk-in Customer",
        total_amount: grandTotal,
        discount: parseFloat(discount) || 0,
        status: "completed",
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      await api.post("/orders", orderPayload);

      // Reset after successful order
      alert("Order completed successfully!");
      setCart([]);
      setCustomerName("");
      setDiscount(0);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress className="text-amber-500" />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in fade-in-up">
      <Box className="mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          Point of Sale
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Process new orders and calculate billing.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side - Product Selection */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            className="p-6 rounded-2xl border border-gray-100 bg-white mb-4"
          >
            <Typography
              variant="h6"
              className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100"
            >
              Add Items
            </Typography>
            <Grid container spacing={2} className="items-end">
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) =>
                    `${option.name} - ₹${option.price}`
                  }
                  value={selectedProduct}
                  onChange={(e, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Qty"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!selectedProduct}
                  onClick={handleAddToCart}
                  className="bg-amber-600 hover:bg-amber-700 py-3.5 shadow-none disabled:bg-gray-200"
                  startIcon={<AddShoppingCartIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Cart Table */}
          <Paper
            elevation={0}
            className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
          >
            {cart.length === 0 ? (
              <Box className="p-12 text-center text-gray-400">
                <ReceiptLongIcon className="text-6xl mb-2 opacity-50" />
                <Typography>Cart is empty. Add some products.</Typography>
              </Box>
            ) : (
              <Box className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-4 font-medium">Item</th>
                      <th className="p-4 font-medium">Price</th>
                      <th className="p-4 font-medium w-24">Qty</th>
                      <th className="p-4 font-medium">Total</th>
                      <th className="p-4 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cart.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/30">
                        <td className="p-4 font-medium text-gray-800">
                          {item.product.name}
                        </td>
                        <td className="p-4 text-gray-500">
                          ₹{item.product.price.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartQuantity(index, e.target.value)
                            }
                            InputProps={{
                              inputProps: { min: 1 },
                              className: "w-20",
                            }}
                          />
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => removeFromCart(index)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side - Summary and Checkout */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            className="p-6 rounded-2xl border border-gray-100 bg-white sticky top-24 shadow-sm"
          >
            <Typography
              variant="h6"
              className="font-bold text-gray-800 mb-6 flex items-center gap-2"
            >
              <ReceiptLongIcon className="text-amber-500" /> Order Summary
            </Typography>

            <Box className="space-y-4 mb-6">
              <TextField
                label="Customer Name (Optional)"
                fullWidth
                variant="outlined"
                size="small"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <TextField
                label="Discount (%)"
                type="number"
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Box>

            <Divider className="my-4" />

            <Box className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount ({discount || 0}%)</span>
                <span>-₹{discAmount.toFixed(2)}</span>
              </div>
              <Divider className="my-3 border-dashed" />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span className="text-amber-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </Box>

            <Button
              fullWidth
              variant="contained"
              className="mt-8 py-4 bg-amber-600 hover:bg-amber-700 text-lg font-bold rounded-xl shadow-md disabled:bg-gray-300 disabled:text-gray-500 transition-all"
              disabled={cart.length === 0 || isSubmitting}
              onClick={handleCheckout}
            >
              {isSubmitting ? (
                <CircularProgress size={28} color="inherit" />
              ) : (
                "Complete Order"
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Billing;
