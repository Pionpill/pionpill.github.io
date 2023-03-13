import React from "react";
import { Outlet } from "react-router";
import Degree from "../../styles";
import Main from "../Main";
import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  align?: string;
  justify?: string;
  gap?: Degree;
  style?: Object;
  bleed?: boolean;
};

const Page: React.FC<Props> = ({ align, justify, gap, bleed, style }) => {
  return (
    <>
      <Header />
      <Main
        align={align}
        justify={justify}
        gap={gap}
        bleed={bleed}
        style={style}
      >
        <Outlet />
      </Main>
      <Footer />
    </>
  );
};
export default Page;
