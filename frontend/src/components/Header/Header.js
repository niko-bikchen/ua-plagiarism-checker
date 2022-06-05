import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";

const Header = () => (
  <AppBar position="sticky">
    <Box display="flex" justifyContent="space-between" padding="10px 20px">
      <Box>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{ color: "white", textDecoration: "none" }}
        >
          UA Plagiarism Checker
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <Button color="inherit" component={Link} to="/texts-list">
          Texts
        </Button>
      </Stack>
    </Box>
  </AppBar>
);

export default Header;
