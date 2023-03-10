import Flex from "../../../components/Flex";
import Page from "../../../components/Flexed/Page";
import Info from "../templates/Info";
import Menu from "../templates/Menu";
import Back from "./Back";
import Basic from "./Basic";
import Front from "./Front";
import Python from "./Python";

const Skills: React.FC = () => {
  return (
    <>
      <Page>
        <Info />
        <Menu />
        <Flex column gap="lg" fullWidth>
          <Basic />
          <Front />
          <Back />
          <Python />
        </Flex>
      </Page>
    </>
  );
};

export default Skills;
