import { Footer } from "../../components/Flexed/Footer";
import { Header } from "../../components/Flexed/Header";
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
      <Main>
        <Info />
        <Menu />
        <Wrapper style={{ gap: "1em" }}>
          <Profile />
          <School />
          <Future />
        </Wrapper>
      </Main>
      <Footer />
    </>
  );
};
