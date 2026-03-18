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
  Chip,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

// Helper: calculate effective unit price after product-level discount
const getDiscountedPrice = (price, discountPct) => {
  const lDisc = parseFloat(discountPct) || 0;
  return price * (1 - lDisc / 100);
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(true);

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

  // Per-item calculations — respects applyDiscount toggle
  const cartWithCalc = useMemo(() => {
    return cart.map((item) => {
      const lOriginalPrice = item.product.price;
      const lDiscPct = applyDiscount ? (parseFloat(item.product.discount) || 0) : 0;
      const lDiscountedUnitPrice = getDiscountedPrice(lOriginalPrice, lDiscPct);
      const lOriginalTotal = lOriginalPrice * item.quantity;
      const lDiscountedTotal = lDiscountedUnitPrice * item.quantity;
      const lSavedAmount = lOriginalTotal - lDiscountedTotal;
      return {
        ...item,
        lOriginalPrice,
        lDiscPct,
        lDiscountedUnitPrice,
        lOriginalTotal,
        lDiscountedTotal,
        lSavedAmount,
      };
    });
  }, [cart, applyDiscount]);

  // Summary calculations
  const lSubTotalOriginal = useMemo(
    () => cartWithCalc.reduce((sum, item) => sum + item.lOriginalTotal, 0),
    [cartWithCalc],
  );

  const lTotalProductDiscount = useMemo(
    () => cartWithCalc.reduce((sum, item) => sum + item.lSavedAmount, 0),
    [cartWithCalc],
  );

  const lGrandTotal = useMemo(
    () => cartWithCalc.reduce((sum, item) => sum + item.lDiscountedTotal, 0),
    [cartWithCalc],
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        order: {
          customer_name: customerName || "Walk-in Customer",
          total_amount: lGrandTotal,
          discount_amount: lTotalProductDiscount,
          status: "completed",
        },
        items: cartWithCalc.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.lDiscountedUnitPrice,
          discount: item.lDiscPct,
        })),
      };

      await api.post("/orders", orderPayload);

      alert("Order completed successfully!");
      setCart([]);
      setCustomerName("");
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
      {/* Header */}
      <Box className="mb-6 flex items-center gap-3">
        <Box
          className="p-2 rounded-xl"
          sx={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
        >
          <ShoppingCartIcon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>
        <div>
          <Typography variant="h5" className="font-bold text-gray-800">
            Point of Sale
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Process new orders and calculate billing.
          </Typography>
        </div>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side */}
        <Grid item xs={12} md={7}>
          {/* Product Selector */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid #f3f4f6", mb: 2 }}
          >
            <Typography
              variant="subtitle1"
              className="font-bold text-gray-700"
              sx={{ mb: 2 }}
            >
              Add Items to Cart
            </Typography>

            {/* Flex row: Autocomplete grows, Qty fixed, Add auto */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
              {/* Product Autocomplete – always at least 300px */}
              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) =>
                    `${option.product_name} - ₹${option.price}${option.discount ? ` (${option.discount}% off)` : ""}`
                  }
                  value={selectedProduct}
                  onChange={(e, newValue) => setSelectedProduct(newValue)}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", gap: 1 }}>
                        <span className="text-gray-800 font-medium">
                          {option.product_name}
                        </span>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {option.discount > 0 && (
                            <Chip
                              label={`${option.discount}% off`}
                              size="small"
                              icon={<LocalOfferIcon />}
                              sx={{ fontSize: 11, bgcolor: "#fff7ed", color: "#c2410c" }}
                            />
                          )}
                          <span className="text-emerald-600 font-semibold text-sm">
                            ₹{getDiscountedPrice(option.price, option.discount).toFixed(2)}
                          </span>
                        </Box>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Box>

              {/* Qty – fixed 90px */}
              <Box sx={{ width: 90, flexShrink: 0 }}>
                <TextField
                  label="Qty"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Box>

              {/* Add button */}
              <Button
                variant="contained"
                disabled={!selectedProduct}
                onClick={handleAddToCart}
                sx={{
                  flexShrink: 0,
                  height: 40,
                  px: 3,
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { background: "#b45309", boxShadow: "none" },
                }}
                startIcon={<AddShoppingCartIcon />}
              >
                Add to Cart
              </Button>
            </Box>
          </Paper>

          {/* Cart Table */}
          <Paper
            elevation={0}
            className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
          >
            <Box className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Typography
                variant="subtitle1"
                className="font-bold text-gray-700"
              >
                Cart
              </Typography>
              {cart.length > 0 && (
                <Chip
                  label={`${cart.length} item${cart.length > 1 ? "s" : ""}`}
                  size="small"
                  className="bg-amber-100 text-amber-700"
                />
              )}
            </Box>

            {cartWithCalc.length === 0 ? (
              <Box className="p-12 text-center text-gray-400">
                <ReceiptLongIcon sx={{ fontSize: 56, opacity: 0.3 }} />
                <Typography className="mt-2 text-gray-400">
                  Cart is empty. Add some products.
                </Typography>
              </Box>
            ) : (
              <Box className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Unit Price</th>
                      <th className="px-4 py-3 font-semibold w-24">Qty</th>
                      <th className="px-4 py-3 font-semibold">Subtotal</th>
                      <th className="px-4 py-3 font-semibold text-center">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartWithCalc.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-amber-50/30 transition-colors"
                      >
                        {/* Product Name + discount badge */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {item.product.product_name}
                          </div>
                          {item.lDiscPct > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-orange-600 mt-0.5">
                              <LocalOfferIcon sx={{ fontSize: 12 }} />
                              {item.lDiscPct}% product discount
                            </span>
                          )}
                        </td>

                        {/* Unit Price */}
                        <td className="px-4 py-3">
                          {item.lDiscPct > 0 ? (
                            <div>
                              <span className="text-gray-400 line-through text-xs block">
                                ₹{item.lOriginalPrice.toFixed(2)}
                              </span>
                              <span className="text-emerald-600 font-semibold">
                                ₹{item.lDiscountedUnitPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-700">
                              ₹{item.lOriginalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Qty Input */}
                        <td className="px-4 py-3">
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartQuantity(index, e.target.value)
                            }
                            InputProps={{ inputProps: { min: 1 } }}
                            sx={{ width: 72 }}
                          />
                        </td>

                        {/* Subtotal */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">
                            ₹{item.lDiscountedTotal.toFixed(2)}
                          </div>
                          {item.lSavedAmount > 0 && (
                            <div className="text-xs text-green-600">
                              Save ₹{item.lSavedAmount.toFixed(2)}
                            </div>
                          )}
                        </td>

                        {/* Remove */}
                        <td className="px-4 py-3 text-center">
                          <Tooltip title="Remove">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => removeFromCart(index)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side - Order Summary */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            className="p-6 rounded-2xl border border-gray-100 bg-white sticky top-24"
          >
            <Typography
              variant="h6"
              className="font-bold text-gray-800 mb-5 flex items-center gap-2"
            >
              <ReceiptLongIcon className="text-amber-500" /> Order Summary
            </Typography>

            {/* Customer Name */}
            <TextField
              label="Customer Name (Optional)"
              fullWidth
              variant="outlined"
              size="small"
              className="mb-3"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            {/* Discount toggle */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={applyDiscount}
                  onChange={(e) => setApplyDiscount(e.target.checked)}
                  sx={{
                    color: "#f59e0b",
                    "&.Mui-checked": { color: "#d97706" },
                  }}
                />
              }
              label={
                <Typography variant="body2" className="text-gray-600 font-medium">
                  Apply product discounts
                </Typography>
              }
              sx={{ mb: 1 }}
            />

            <Divider className="my-3" />


            {/* Per-item breakdown */}
            {cartWithCalc.length > 0 && (
              <Box className="mb-4 space-y-2 max-h-40 overflow-y-auto pr-1">
                {cartWithCalc.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span className="truncate max-w-[55%]">
                      {item.product.product_name}{" "}
                      <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                    <div className="text-right">
                      <span className="font-medium text-gray-800">
                        ₹{item.lDiscountedTotal.toFixed(2)}
                      </span>
                      {item.lSavedAmount > 0 && (
                        <span className="block text-xs text-green-600">
                          -₹{item.lSavedAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </Box>
            )}

            <Divider className="my-4 border-dashed" />

            {/* Totals */}
            <Box className="space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal (MRP)</span>
                <span>₹{lSubTotalOriginal.toFixed(2)}</span>
              </div>

              {lTotalProductDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <LocalOfferIcon sx={{ fontSize: 14 }} />
                    Product Discounts
                  </span>
                  <span>-₹{lTotalProductDiscount.toFixed(2)}</span>
                </div>
              )}

              <Divider className="border-dashed" />

              <div className="flex justify-between font-bold text-xl text-gray-800">
                <span>Total Payable</span>
                <span className="text-amber-600">
                  ₹{lGrandTotal.toFixed(2)}
                </span>
              </div>

              {lTotalProductDiscount > 0 && (
                <div className="text-center text-xs text-green-600 bg-green-50 rounded-lg py-1.5 font-medium">
                  🎉 You save ₹{lTotalProductDiscount.toFixed(2)} on this order!
                </div>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
                background: "linear-gradient(135deg,#f59e0b,#d97706)",
                "&:hover": {
                  background: "#b45309",
                  boxShadow: "0 6px 18px rgba(180,83,9,0.4)",
                },
                "&:disabled": {
                  background: "#e5e7eb",
                  color: "#9ca3af",
                  boxShadow: "none",
                },
              }}
              disabled={cart.length === 0 || isSubmitting}
              onClick={handleCheckout}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Complete Order · ₹${lGrandTotal.toFixed(2)}`
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Billing;
