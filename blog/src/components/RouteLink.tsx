import { darken, lighten } from "polished";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Degree, { TextColor } from "../styles";
import { common, light } from "../styles/themes";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  color?: TextColor | "blue" | "link";
  shallow?: Degree;
  size?: Degree;
  weight?: Degree;
};

const RouteLink = styled(Link)<Props>`
  color: ${({ shallow, color, theme }) =>
    theme === light
      ? lighten(
          shallowSelector(shallow),
          color === "blue"
            ? common.pointer
            : color === "link"
            ? common.link
            : textColorSelector(color, theme)
        )
      : darken(
          shallowSelector(shallow),
          color === "blue"
            ? common.pointer
            : color === "link"
            ? common.link
            : textColorSelector(color, theme)
        )};
  font-size: initial;
  display: flex;
  font-weight: 400;
  padding: 0.5em 0.75em;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  flex-direction: row;
  font-size: ${({ size }) => fontSizeSelector(size)};
  font-weight: ${({ weight }) => fontWeightSelector(weight)};
  &:hover {
    color: ${({ theme }) => theme.blue};
    transition: all 0.5s;
  }
`;

export default RouteLink;
