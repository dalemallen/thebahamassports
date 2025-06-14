import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * BackButton Component
 * 
 * Usage:
 * <BackButton fallback="/teams" label="Back to Teams" />
 */
export default function BackButton({ fallback = "/", label = "Back" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
      {label}
    </Button>
  );
}
