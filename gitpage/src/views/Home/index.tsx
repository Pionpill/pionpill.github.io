import { Outlet } from "react-router";
import Info from "./Info";
import LinkTabs from "./LinkTabs";

const Home: React.FC = () => {
  return (
    <>
      <Info />
      <LinkTabs />
      <Outlet />
    </>
  );
};

export default Home;
