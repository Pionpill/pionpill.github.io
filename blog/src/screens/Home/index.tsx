import { Outlet } from "react-router";
import Flex from "../../components/Flex";
import Info from "./templates/Info";
import Menu from "./templates/Menu";

const Home: React.FC = () => {
  return (
    <>
      <Info />
      <Menu />
      <Flex column gap="lg" fullWidth>
        <Outlet />
      </Flex>
    </>
  );
};

export default Home;
