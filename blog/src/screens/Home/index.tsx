import Flex from "../../components/Flex";
import { Footer } from "../../components/Flexed/Footer";
import { Header } from "../../components/Flexed/Header";
import { Main } from "../../components/Main";
import { Future } from "./Experience/Future";
import { Profile } from "./Experience/Profile";
import { School } from "./Experience/School";
import { Info } from "./Info";
import { Menu } from "./Menu";

export const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Main>
        <Info />
        <Menu />
        <Flex style={{ gap: "1em" }}>
          <Profile />
          <School />
          <Future />
        </Flex>
      </Main>
      <Footer />
    </>
  );
};
