import { Footer } from "../../../components/Flexed/Footer";
import { Header } from "../../../components/Flexed/Header";
import { Main } from "../../../components/Main";
import { Info } from "../Info";
import { Menu } from "../Menu";
import { Skills } from "./Skills";
import { Wrapper } from "./Wrapper";

export const Skill: React.FC = () => {
  return (
    <>
      <Header />
      <Main column>
        <Info />
        <Menu />
        <Wrapper gap="1em">
          <Skills />
        </Wrapper>
      </Main>
      <Footer />
    </>
  );
};
