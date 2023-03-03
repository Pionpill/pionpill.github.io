import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontSize, FontWeight } from "../styles";
import { fontSizeSelector, fontWeightSelector } from "../utils/styledUtils";

type Props = {
  padding?: string;
  size?: FontSize;
  weight?: FontWeight;
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
  font-size: ${(props) => fontSizeSelector(props.size)};
  font-weight: ${(props) => fontWeightSelector(props.weight)};
  &:hover {
    color: ${(props) => props.theme.blue};
    transition: all 0.5s;
  }
`;
