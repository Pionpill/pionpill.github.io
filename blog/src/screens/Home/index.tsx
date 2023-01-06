import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { Brief } from "./Brief";
import { Info } from "./Info";
import { Menu } from "./Menu";

export const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Main column={true}>
        <Info />
        <Menu />
        <Brief />
      </Main>
      <Footer />
    </>
  );
};
