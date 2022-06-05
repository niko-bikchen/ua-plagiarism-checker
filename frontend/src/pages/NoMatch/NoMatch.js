import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const NoMatchPage = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        textAlign: "center",
      }}
    >
      <Typography variant="h3">404</Typography>
      <Typography variant="h5" marginTop="10px">
        Could not find the page you have requested
      </Typography>
      <Typography variant="h5" marginTop="10px" marginBottom="20px">
        ಥ_ಥ
      </Typography>
      <Button component={Link} to="/" variant="contained">
        To the Main Page
      </Button>
    </Box>
  );
};

export default NoMatchPage;
