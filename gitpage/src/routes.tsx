import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import View from "./views";
import Article from "./views/Article";
import Pdf from "./views/Article/pdf";
import Blog from "./views/Blog";
import Error from "./views/Error";
import Home from "./views/Home";
import Experience from "./views/Home/Experience";
import Profile from "./views/Home/Profile";
import Technology from "./views/Home/Technology";
import Project from "./views/Project";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<View />}>
          <Route index element={<Navigate to="/home/profile" replace />} />
          <Route path="home" element={<Home />}>
            <Route index element={<Navigate to="/home/profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="experience" element={<Experience />} />
            <Route path="technology" element={<Technology />} />
          </Route>
          <Route path="article" element={<Article />} />
          <Route path="article/:articleName" element={<Pdf />} />
          <Route path="blog/*" element={<Blog />} />
          <Route path="project" element={<Project />}/>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
