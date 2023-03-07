import { lighten } from "polished";
import styled, { css } from "styled-components";
import Degree, { TextColor } from "../styles";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

const P = styled.p<{
  size?: Degree;
  shallow?: Degree;
  color?: TextColor;
  shadow?: boolean;
  center?: boolean;
  isTitle?: boolean;
  weight?: Degree;
  space?: string;
}>`
  color: ${({ shallow, color, theme }) =>
    lighten(shallowSelector(shallow), textColorSelector(color, theme))};
  padding: ${({ size }) =>
    size === "xxs" || size === "xs" ? "2px 0" : "4px 0"};
  text-align: ${({ center }) => (center ? "center" : "left")};
  margin: 0;
  text-shadow: ${({ shadow, theme }) =>
    shadow ? `.5px .5px 1px ${theme.shadow}` : "auto"};
  font-size: ${({ size }) => fontSizeSelector(size)};
  font-weight: ${({ weight }) => fontWeightSelector(weight)};
  ${({ isTitle }) =>
    isTitle &&
    css`
      font-size: ${() => fontSizeSelector("lg")};
      font-weight: ${() => fontWeightSelector("xl")};
    `}
  letter-spacing: ${({ space }) => space};
`;

export default P;
