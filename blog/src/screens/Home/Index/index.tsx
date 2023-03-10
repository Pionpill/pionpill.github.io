import Flex from "../../../components/Flex";
import Page from "../../../components/Flexed/Page";
import Info from "../templates/Info";
import Menu from "../templates/Menu";
import Life from "./Life";
import Profile from "./Profile";
import Skill from "./Skill";
import State from "./State";

const Index: React.FC = () => {
  return (
    <>
      <Page>
        <Info />
        <Menu />
        <Flex column gap="lg" fullWidth>
          <Profile />
          <State />
          <Skill />
          <Life />
        </Flex>
      </Page>
    </>
  );
};

export default Index;
