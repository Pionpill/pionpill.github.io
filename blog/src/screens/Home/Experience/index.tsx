import { Footer } from "../../../components/Flexed/Footer";
import { Header } from "../../../components/Flexed/Header";
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
      <Main>
        <Info />
        <Menu />
        <Wrapper style={{ gap: "1em" }}>
          <Teen />
          <Collage />
        </Wrapper>
      </Main>
      <Footer />
    </>
  );
};
