import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Основной цвет
    },
    secondary: {
      main: "#ff4081", // Второстепенный цвет
    },
    background: {
      default: "#f5f5f5", // Фон приложения
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Настройка шрифтов
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
