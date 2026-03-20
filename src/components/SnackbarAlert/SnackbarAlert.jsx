import React from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * Reusable snackbar notification component.
 *
 * Props:
 *  - open       {boolean}  Whether the snackbar is visible
 *  - message    {string}   Text to display
 *  - severity   {string}   "success" | "error" | "warning" | "info"  (default: "success")
 *  - onClose    {function} Called when the snackbar should close
 *  - duration   {number}   Auto-hide duration in ms (default: 4000)
 */
const SnackbarAlert = ({
  open,
  message,
  severity = "success",
  onClose,
  duration = 4000,
}) => {
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: "12px", fontWeight: 600 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
