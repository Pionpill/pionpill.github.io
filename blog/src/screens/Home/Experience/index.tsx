import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
import { Main } from "../../../components/Main";
import { Info } from "../Info";
import { Menu } from "../Menu";
import { Collage } from "./Collage";
import { Teen } from "./Teen";
import { Wrapper } from "./Wrapper";

export const Experience: React.FC = () => {
  return (
    <>
      <Header />
      <Main column={true}>
        <Info />
        <Menu />
        <Wrapper gap="1em">
          <Teen />
          <Collage />
        </Wrapper>
      </Main>
      <Footer />
    </>
  );
};
