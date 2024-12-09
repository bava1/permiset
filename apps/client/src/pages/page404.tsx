import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const Page404 = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
        sx={{ mt: 3 }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default Page404;
