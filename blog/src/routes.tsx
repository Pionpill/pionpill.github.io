import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error } from "./screens/Error";
import { Home } from "./screens/Home";
import { Brief } from "./screens/Home/Brief";
import { Experience } from "./screens/Home/Experience";

export const MainRoute: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/experience" element={<Experience />} />
        {/* <Route path="/skill" element={<Skill />} /> */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
