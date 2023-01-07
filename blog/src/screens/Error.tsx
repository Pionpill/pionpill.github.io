import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import P from "../components/P";

export const Error: React.FC = () => {
  return (
    <>
      <Header />
      <Main justify="center" align="center" column={true} height="50vh">
        <P size="10em" weight="heavy" type="danger">
          404
        </P>
        <P size="large" wrap={true}>
          ERROR 404 - PAGE NOT FOUND
        </P>
        <P size="large" wrap={true}>
          您可通过上方链接重定位到其他位置
        </P>
      </Main>
      <Footer bottom={true} />
    </>
  );
};
