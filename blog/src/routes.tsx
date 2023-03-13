import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Page from "./components/Flexed/Page";
import Article from "./screens/Article/Index";
import Pdf from "./screens/Article/Pdf";
import Error from "./screens/Error";
import Home from "./screens/Home";
import Experience from "./screens/Home/Experience";
import Profiles from "./screens/Home/Profiles";
import Skills from "./screens/Home/Skill";

export const MainRoute: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route index element={<Navigate to="/index" replace />} />
          <Route path="index" element={<Home />}>
            <Route index element={<Profiles />} />
            <Route path="experience" element={<Experience />} />
            <Route path="skill" element={<Skills />} />
          </Route>
          <Route path="article" element={<Article />}></Route>
          <Route path="article/:articleName" element={<Pdf />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
