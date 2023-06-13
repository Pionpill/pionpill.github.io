import { PropsWithChildren } from "react";
import { Outlet } from "react-router";
import Dialogs from "./Dialogs";
import Footer from "./Footer";
import Header from "./Header";

const View: React.FC<PropsWithChildren> = () => {
  return (
    <>
      <Dialogs />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default View;
