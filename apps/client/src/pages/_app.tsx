import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import "../i18n"; 
import { appWithTranslation } from "next-i18next";


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const unprotectedRoutes = ["/auth/login", "/auth/register", "/page404"];
  const isUnprotectedRoute = unprotectedRoutes.includes(router.pathname);

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
