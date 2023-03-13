import React from "react";
import Flex from "../components/Flex";
import H1 from "../components/H1";
import P from "../components/P";

const Error: React.FC = () => {
  return (
    <Flex
      padding="48px 0"
      column
      gap="xxs"
      style={{ width: "100%", minHeight: "500px" }}
    >
      <H1>404</H1>
      <P size="lg" isTitle>
        PAGE NOT FOUND
      </P>
      <P size="lg">您可通过上方链接前往其他地址</P>
      <P size="lg" shallow="md">
        =.= 网站处于开发阶段，好多页面没写 =.=
      </P>
    </Flex>
  );
};

export default Error;
