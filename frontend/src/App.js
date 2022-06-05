import React from "react";
import { Routes, Route } from "react-router-dom";

import { TextsProvider } from "./contexts/TextsContext";

import Box from "@mui/material/Box";

import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import Texts from "./pages/Texts";
import NoMatchPage from "./pages/NoMatch";

const App = () => {
  return (
    <Box>
      <Header />
      <Box padding="30px 10%">
        <TextsProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/texts-list" element={<Texts />} />
            <Route path="*" element={<NoMatchPage />} />
          </Routes>
        </TextsProvider>
      </Box>
    </Box>
  );
};

export default App;
