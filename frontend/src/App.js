import React from "react";
import { Routes, Route } from "react-router-dom";

import { TextsProvider } from "./contexts/TextsContext";

import Box from "@mui/material/Box";

import Header from "./components/Header";
import MainPage from "./pages/MainPage";

const App = () => {
  return (
    <Box>
      <Header />
      <Box padding="30px 10%">
        <TextsProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </TextsProvider>
      </Box>
    </Box>
  );
};

export default App;
