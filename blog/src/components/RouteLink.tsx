import { lighten } from "polished";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontSize, FontWeight, ShallowDegree, TextColor } from "../styles";
import { common } from "../styles/themes";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  color?: TextColor | "blue" | "link";
  shallow?: ShallowDegree;
  size?: FontSize;
  weight?: FontWeight;
};

const RouteLink = styled(Link)<Props>`
  color: ${({ shallow, color, theme }) =>
    lighten(
      shallowSelector(shallow),
      color === "blue"
        ? common.pointer
        : color === "link"
        ? common.link
        : textColorSelector(color, theme)
    )};
  font-size: initial;
  font-weight: 400;
  padding: 0.5em 0.75em;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: ${({ size }) => fontSizeSelector(size)};
  font-weight: ${({ weight }) => fontWeightSelector(weight)};
  &:hover {
    color: ${({ theme }) => theme.blue};
    transition: all 0.5s;
  }
`;

export default RouteLink;
