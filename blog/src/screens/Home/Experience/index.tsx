import Flex from "../../../components/Flex";
import Page from "../../../components/Flexed/Page";
import { Info } from "../Info";
import { Menu } from "../Menu";
import { Collage } from "./Collage";
import { Teen } from "./Teen";

export const Experience: React.FC = () => {
  return (
    <>
      <Page>
        <Info />
        <Menu />
        <Flex column bleed style={{ gap: "1em" }}>
          <Teen />
          <Collage />
        </Flex>
      </Page>
    </>
  );
};
