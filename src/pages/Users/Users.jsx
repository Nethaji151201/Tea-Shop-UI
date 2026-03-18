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
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role_id: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const filteredUsers = users.filter((user) => {
    const lQuery = searchQuery.toLowerCase();
    return (
      (user.fullname || "").toLowerCase().includes(lQuery) ||
      (user.username || "").toLowerCase().includes(lQuery) ||
      String(user.id || "").includes(lQuery)
    );
  });

  const handleOpenNew = () => {
    setEditingUser(null);
    setFormData({ fullname: "", username: "", password: "", role_id: 0 });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname || "",
      username: user.username || "",
      password: "",
      role_id: user.role_id || 0,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  return (
    <Box className="animate-fade-in fade-in-up">
      <Box className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h5" className="font-bold text-gray-800">
            User Management
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Create users, manage access and assign roles.
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenNew}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg capitalize px-4 shadow-sm"
        >
          Add User
        </Button>
      </Box>

      {/* Search Bar */}
      <Box className="mb-4">
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search by name, username or ID..."
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
          <CircularProgress className="text-purple-500" />
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
                  Username
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Role
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    className="py-8 text-gray-500"
                  >
                    {searchQuery ? "No users match your search." : "No users found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="text-gray-500">
                      {user.id || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {user.fullname}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.role_id === 1
                            ? "Super Admin"
                            : user.role_id === 2
                              ? "Admin"
                              : "Staff"
                        }
                        size="small"
                        className={`capitalize font-medium ${
                          user.role_id === 2
                            ? "bg-amber-100 text-amber-700"
                            : user.role_id === 1
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        className="text-blue-500 hover:bg-blue-50 mr-1"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(user.id)}
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

      {/* User Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "rounded-xl" }}
      >
        <DialogTitle className="font-bold border-b border-gray-100">
          {editingUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent className="pt-6">
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            className="mb-4"
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mb-4"
          />
          {!editingUser && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              required
              variant="outlined"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mb-4"
            />
          )}
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={formData.role_id}
            onChange={(e) =>
              setFormData({ ...formData, role_id: e.target.value })
            }
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id} className="capitalize">
                {role.role_name}
              </MenuItem>
            ))}
          </TextField>
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
            className="bg-amber-600 hover:bg-amber-700 shadow-none"
          >
            {editingUser ? "Save Changes" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
