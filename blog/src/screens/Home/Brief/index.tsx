import { Footer } from "../../../components/Flexed/Footer";
import { Header } from "../../../components/Flexed/Header";
import { Main } from "../../../components/Main";
import { Info } from "../Info";
import { Menu } from "../Menu";
import { Future } from "./Future";
import { Profile } from "./Profile";
import { School } from "./School";
import { Wrapper } from "./Wrapper";

export const Brief: React.FC = () => {
  return (
    <>
      <Header />
      <Main column>
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
