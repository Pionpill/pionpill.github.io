import { Link } from "react-router-dom";
import styled from "styled-components";

type Props = {
  padding?: string;
  size?: "large" | "small" | "xsmall";
  weight?: "bold" | "thin" | "heavy";
};

export const RouteLink = styled(Link)<Props>`
  color: ${(props) => props.theme.text_reverse};
  font-size: initial;
  font-weight: 400;
  padding: ${(props) => (props.padding ? props.padding : "0.5em 0.75em")};
  padding: 0.5em 0.75em;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: ${(props) =>
    props.size === "large"
      ? "18px"
      : props.size === "small"
      ? "14px"
      : props.size === "xsmall"
      ? "13px"
      : "inherit"};
  font-weight: ${(props) =>
    props.weight === "bold"
      ? "600"
      : props.weight === "thin"
      ? "200"
      : props.weight === "heavy"
      ? "800"
      : "inherit"};

  &:hover {
    color: ${(props) => props.theme.blue};
    transition: all 0.5s;
  }
`;
