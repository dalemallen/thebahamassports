import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#00A3E0",
		},
		secondary: {
			main: "#FFD100",
		},
		background: {
			default: "#FFFFFF",
		},
		text: {
			primary: "#000000",
		},
	},
	typography: {
		fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: "2.25rem",
			fontWeight: 600,
		},
		h2: {
			fontSize: "1.75rem",
			fontWeight: 600,
		},
		body1: {
			fontSize: "1rem",
		},
	},
});

// ✅ Base: #FFFFFF (white background), #000000 (black text)

// ✨ Accent: Use soft Bahamas color hints:

// Highlight: #00A3E0 (sky blue)

// Accent: #FFD100 (sun yellow)

// Optional soft tone: #00C48D (aqua green)

export default theme;
