import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
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
