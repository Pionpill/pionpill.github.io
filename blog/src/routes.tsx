import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error } from "./screens/Error";
import { Home } from "./screens/Home";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/brief" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
