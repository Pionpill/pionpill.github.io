import { Route, Routes } from "react-router-dom";
import { Home } from "./screens/Home";

export const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};
