import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error from "./screens/Error";
import Experience from "./screens/Home/Experience";
import Index from "./screens/Home/Index";
import Skills from "./screens/Home/Skill";

export const MainRoute: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/skill" element={<Skills />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
