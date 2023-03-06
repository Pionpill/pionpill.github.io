import Flex from "../../../components/Flex";
import { Footer } from "../../../components/Flexed/Footer";
import { Header } from "../../../components/Flexed/Header";
import { Main } from "../../../components/Main";
import { Info } from "../Info";
import { Menu } from "../Menu";

export const Brief: React.FC = () => {
  return (
    <>
      <Header />
      <Main>
        <Info />
        <Menu />
        <Flex style={{ gap: "1em" }}>
          {/* <Profile />
          <School />
          <Future /> */}
        </Flex>
      </Main>
      <Footer />
    </>
  );
};
