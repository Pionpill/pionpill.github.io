import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { ExperienceContext } from "./ExperienceContext";
import { Info } from "./Info";
import { Menu } from "./Menu";

export const Experience: React.FC = () => {
  return (
    <>
      <Header />
      <Main column={true}>
        <Info />
        <Menu />
        <ExperienceContext />
      </Main>
      <Footer />
    </>
  );
};
