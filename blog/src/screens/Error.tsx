import React from "react";
import Flex from "../components/Flex";
import H1 from "../components/H1";
import P from "../components/P";
import Page from "../components/Page";
import { setFooterPosition } from "../utils/componentsUtils";

export const Error: React.FC = () => {
  React.useEffect(() => setFooterPosition);

  return (
    <Page>
      <Flex column padding="100px 0">
        <H1>404</H1>
        <P size="lg">PAGE NOT FOUND</P>
        <P size="lg">您可通过上方链接前往其他地址</P>
        <P size="lg" shallow="md">
          =.= 网站处于开发阶段，好多页面没写 =.=
        </P>
      </Flex>
    </Page>
  );
};
