import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Список маршрутов для MainLayout
  const mainLayoutRoutes = ["/", "/users", "/issues", "/blog", "/docs", "/setting"];

  // Проверяем, должен ли текущий маршрут использовать MainLayout
  const isMainLayoutRoute = mainLayoutRoutes.some((path) => router.pathname.startsWith(path));

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isMainLayoutRoute ? (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}


