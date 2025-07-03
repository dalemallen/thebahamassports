import React from "react";
import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export default function ShareButton({ title }) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: title || "Event", url });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <>
      <Tooltip title="Share this event">
        <IconButton
          onClick={handleShare}
          sx={{ color: "black" }}
          aria-label="Share this event"
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          Event link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
