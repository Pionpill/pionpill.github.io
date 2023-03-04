import React from "react";
import { Footer } from "./Flexed/Footer";
import { Header } from "./Flexed/Header";
import { Main } from "./Main";

const Page: React.FC<{ children: any }> = ({ children }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};
export default Page;
