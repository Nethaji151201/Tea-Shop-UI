import { useState, useCallback } from "react";

/**
 * useSnackbar — reusable hook for managing SnackbarAlert state.
 *
 * Usage:
 *   const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
 *
 *   showSnackbar("Message here", "success" | "error" | "warning" | "info");
 *
 *   <SnackbarAlert
 *     open={snackbar.open}
 *     message={snackbar.message}
 *     severity={snackbar.severity}
 *     onClose={closeSnackbar}
 *   />
 */
const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "warning" | "info"
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showSnackbar, closeSnackbar };
};

export default useSnackbar;
