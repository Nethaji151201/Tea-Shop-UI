import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../services/api";
import SnackbarAlert from "../../components/SnackbarAlert/SnackbarAlert";
import useSnackbar from "../../hooks/useSnackbar";

const Product = () => {
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    product_name: "",
    price: 0.0,
    stock: 0,
    description: "",
    discount: 0,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const lQuery = searchQuery.toLowerCase();
    return (
      (product.product_name || "").toLowerCase().includes(lQuery) ||
      String(product.id || "").includes(lQuery) ||
      String(product.price || "").includes(lQuery)
    );
  });

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormData({
      product_name: "",
      price: 0,
      stock: 0,
      description: "",
      discount: 0,
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name || "",
      price: product.price || 0,
      stock: product.stock || 0,
      description: product.description || "",
      discount: product.discount || 0,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      showSnackbar("Product deleted successfully.", "success");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      const errMsg =
        error.response?.data?.message || "Failed to delete product. Please try again.";
      showSnackbar(errMsg, "error");
    }
  };

  const handleSave = async () => {
    if (!formData.product_name || !formData.price) {
      showSnackbar("Product name and price are required.", "warning");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        discount: parseFloat(formData.discount) || 0,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        showSnackbar(`"${formData.product_name}" updated successfully.`, "success");
      } else {
        await api.post("/products", [payload]);
        showSnackbar(`"${formData.product_name}" added to inventory.`, "success");
      }
      setOpenDialog(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      const errMsg =
        error.response?.data?.message || "Failed to save product. Please try again.";
      showSnackbar(errMsg, "error");
    }
  };

  return (
    <Box className="animate-fade-in fade-in-up">
      <Box className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h5" className="font-bold text-gray-800">
            Product Inventory
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Manage your tea varieties, prices, and stock levels.
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleOpenNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg capitalize px-4 shadow-sm"
        >
          Add Product
        </Button>
      </Box>

      {/* Search Bar */}
      <Box className="mb-4">
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search by name, ID or price..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress className="text-emerald-500" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          className="border border-gray-100 rounded-2xl shadow-sm"
        >
          <Table>
            <TableHead className="bg-gray-50/50">
              <TableRow>
                <TableCell className="font-semibold text-gray-600">
                  ID
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Name
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Price (₹)
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Discount (%)
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Stock
                </TableCell>
                <TableCell
                  align="right"
                  className="font-semibold text-gray-600"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="py-8 text-gray-500"
                  >
                    {searchQuery
                      ? "No products match your search."
                      : "No products found. Add some inventory!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="text-gray-500">
                      {product.id || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {product.product_name}
                      {product.description && (
                        <Typography
                          variant="caption"
                          display="block"
                          className="text-gray-400"
                        >
                          {product.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {product.price ? product.price.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell>
                      {product.discount && product.discount > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          {product.discount}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock < 10
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        className="text-blue-500 hover:bg-blue-50 mr-1"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "rounded-xl" }}
      >
        <DialogTitle className="font-bold border-b border-gray-100">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent className="pt-6">
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={formData.product_name}
            onChange={(e) =>
              setFormData({ ...formData, product_name: e.target.value })
            }
            className="mb-4"
          />
          <Box className="flex gap-4 mb-4">
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Stock Quantity"
              type="number"
              fullWidth
              required
              variant="outlined"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
          </Box>
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            variant="outlined"
            InputProps={{
              inputProps: { min: 0, max: 100 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
            className="mb-4"
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button
            onClick={() => setOpenDialog(false)}
            className="text-gray-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            className="bg-emerald-600 hover:bg-emerald-700 shadow-none"
          >
            {editingProduct ? "Save Changes" : "Save Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar — success / error / warning notifications */}
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default Product;
