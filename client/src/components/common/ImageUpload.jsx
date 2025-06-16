
import { Box, Button, Avatar } from "@mui/material";

const ImageUpload = ({ label, name, onChange, preview }) => {
  return (
    <Box>
      <Button variant="outlined" component="label" fullWidth>
        {label}
        <input
          type="file"
          name={name}
          accept="image/*"
          hidden
          onChange={onChange}
        />
      </Button>
      {preview && (
        <Box mt={1}>
          {name === "logo" ? (
            <Avatar src={preview} alt={`${label} Preview`} sx={{ width: 80, height: 80 }} />
          ) : (
            <img
              src={preview}
              alt={`${label} Preview`}
              style={{ width: "100%", maxHeight: 150, objectFit: "cover" }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
