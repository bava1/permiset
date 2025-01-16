import { createTheme } from "@mui/material/styles";
import { PaletteOptions } from "@mui/material/styles/createPalette";

// Расширение типов для customColors
declare module "@mui/material/styles" {
  interface Palette {
    customColors: {
      administrator: string;
      manager: string;
      user: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      administrator: string;
      manager: string;
      user: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary color
    },
    secondary: {
      main: "#ff4081", // Secondary color
    },
    background: {
      default: "#f5f5f5", // Application background
    },
    customColors: {
      administrator: "#ffcdd2",
      manager: "#b2dfdb",
      user: "#b3e5fc",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
});

export default theme;
