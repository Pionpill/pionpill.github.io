import React from "react";
import Page from "../components/Flexed/Page";
import H1 from "../components/H1";
import P from "../components/P";

const Error: React.FC = () => {
  return (
    <Page style={{ padding: "100px 1.5vw" }}>
      <H1>404</H1>
      <P size="lg">PAGE NOT FOUND</P>
      <P size="lg">您可通过上方链接前往其他地址</P>
      <P size="lg" shallow="md">
        =.= 网站处于开发阶段，好多页面没写 =.=
      </P>
    </Page>
  );
};

export default Error;
