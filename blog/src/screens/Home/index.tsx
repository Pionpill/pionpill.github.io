import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { Future } from "./Brief/Future";
import { Profile } from "./Brief/Profile";
import { School } from "./Brief/School";
import { Wrapper } from "./Brief/Wrapper";
import { Info } from "./Info";
import { Menu } from "./Menu";

export const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Main column={true}>
        <Info />
        <Menu />
        <Wrapper gap="1em">
          <Profile />
          <School />
          <Future />
        </Wrapper>
      </Main>
      <Footer />
    </>
  );
};
