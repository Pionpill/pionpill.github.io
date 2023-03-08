import Flex from "../../../components/Flex";
import Page from "../../../components/Flexed/Page";
import Info from "../templates/Info";
import Menu from "../templates/Menu";
import Front from "./Front";

const Skills: React.FC = () => {
  return (
    <>
      <Page>
        <Info />
        <Menu />
        <Flex column gap="lg" fullWidth>
          <Front />
        </Flex>
      </Page>
    </>
  );
};

export default Skills;
