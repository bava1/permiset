import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import * as Sentry from "@sentry/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // List of routes that do not require authentication
  const unprotectedRoutes = ["/auth/login", "/auth/register", "/page404"];
  const isUnprotectedRoute = unprotectedRoutes.includes(router.pathname);

  Sentry.init({
    dsn: "https://60f179062c6a3998a39e83584386da5b@o4508103201128448.ingest.de.sentry.io/4508494945255504",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

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
