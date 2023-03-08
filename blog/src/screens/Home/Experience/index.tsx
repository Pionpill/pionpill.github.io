import Flex from "../../../components/Flex";
import Page from "../../../components/Flexed/Page";
import Info from "../templates/Info";
import Menu from "../templates/Menu";
import Collage from "./Collage";
import Future from "./Future";
import Teen from "./Teen";

const Experience: React.FC = () => {
  return (
    <>
      <Page>
        <Info />
        <Menu />
        <Flex column gap="lg" fullWidth>
          <Teen />
          <Collage />
          <Future />
        </Flex>
      </Page>
    </>
  );
};

export default Experience;
