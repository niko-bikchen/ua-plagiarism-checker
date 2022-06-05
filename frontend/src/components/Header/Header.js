import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";

const Header = () => (
  <AppBar position="sticky">
    <Box display="flex" justifyContent="space-between" padding="10px 20px">
      <Box>
        <Typography variant="h6">UA Plagiarism Checker</Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <Button color="inherit">Texts</Button>
      </Stack>
    </Box>
  </AppBar>
);

export default Header;
