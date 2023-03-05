import { lighten } from "polished";
import styled, { CSSProperties } from "styled-components";
import { FontSize, FontWeight, ShallowDegree, TextColor } from "../styles";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

const P = styled.p<{
  size?: FontSize;
  shallow?: ShallowDegree;
  color?: TextColor;
  shadow?: boolean;
  textAlign?: CSSProperties["textAlign"];
  weight?: FontWeight;
  space?: string;
}>`
  font-size: ${({ size }) => fontSizeSelector(size)};
  color: ${({ shallow, color, theme }) =>
    lighten(shallowSelector(shallow), textColorSelector(color, theme))};
  padding: 4px 0;
  text-align: ${({ textAlign }) => textAlign};
  font-weight: ${({ weight }) => fontWeightSelector(weight)};
  margin: 0;
  text-shadow: ${({ shadow, theme }) =>
    shadow ? `.5px .5px 1px ${theme.shadow}` : "auto"};
  letter-spacing: ${({ space }) => space};
`;

export default P;
