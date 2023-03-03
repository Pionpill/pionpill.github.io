import { Footer } from "../components/Flexed/Footer";
import { Header } from "../components/Flexed/Header";
import { Main } from "../components/Main";
import P from "../components/P";

export const Error: React.FC = () => {
  return (
    <>
      <Header />
      <Main justify="center" align="center" column height="50vh">
        <P size="xxl" weight="xl">
          404
        </P>
        <P size="lg">ERROR 404 - PAGE NOT FOUND</P>
        <P size="lg">您可通过上方链接重定位到其他位置</P>
        <P size="lg" shallow="md">
          =.= 网站处于开发阶段，好多页面没写 =.=
        </P>
      </Main>
      <Footer bottom />
    </>
  );
};
