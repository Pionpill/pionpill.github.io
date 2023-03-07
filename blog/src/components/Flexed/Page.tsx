import React, { ReactNode } from "react";
import Degree from "../../styles";
import { Main } from "../Main";
import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  align?: string;
  justify?: string;
  gap?: Degree;
  style?: Object;
  bleed?: boolean;
  children: ReactNode;
};

const Page: React.FC<Props> = ({
  align,
  justify,
  gap,
  bleed,
  style,
  children,
}) => {
  React.useEffect(() => {
    const footer = document.getElementById("footer");
    if (
      footer &&
      document.body.clientHeight < document.documentElement.clientHeight
    ) {
      footer.style.position = "fixed";
      footer.style.bottom = "0";
    }
  });

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
        {children}
      </Main>
      <Footer />
    </>
  );
};
export default Page;
