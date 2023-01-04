import Flex from "../../components/Flex";
import { Header } from "../../components/Header";
import { Info } from "./Info";

export const Home: React.FC = () => {
  return (
    <>
      <Header></Header>
      <Flex>
        <Info />
      </Flex>
    </>
  );
};
