import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { Info } from "./Info";

export const Home: React.FC = () => {
  return (
    <>
      <Header></Header>
      <Main>
        <Info />
      </Main>
    </>
  );
};
