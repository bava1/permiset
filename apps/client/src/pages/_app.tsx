import { AppProps } from "next/app";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import "../i18n";
import { appWithTranslation } from "next-i18next";
import { CircularProgress, Box } from "@mui/material";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} router={router} /> 
    </AuthProvider>
  );
}

function AppContent({ Component, pageProps, router }: AppProps) { 
  const { isAuthLoading } = useAuth(); // ✅ Now we wait for the authentication to load

  const unprotectedRoutes = ["/auth/login", "/auth/register", "/page404"];
  const isUnprotectedRoute = unprotectedRoutes.includes(router.pathname);

  // ✅ While authentication is loading → show only spinner (without Layout)
  if (isAuthLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isUnprotectedRoute ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ProtectedRoute>
      )}
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
