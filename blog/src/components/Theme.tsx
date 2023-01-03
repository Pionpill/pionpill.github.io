import React from "react";
import { ThemeProvider } from "styled-components";
import { light } from "../styles/themes";

type Props = {
  children: any;
};

const Theme: React.FC<Props> = ({ children }) => {
  // TODO: 切换颜色主题
  const theme = light;
  return <ThemeProvider theme={theme}> {children} </ThemeProvider>;
};

export default Theme;
