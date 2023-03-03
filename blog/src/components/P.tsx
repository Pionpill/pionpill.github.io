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
  maxWidth?: CSSProperties["maxWidth"];
  minWidth?: CSSProperties["minWidth"];
  textAlign?: CSSProperties["textAlign"];
  weight?: FontWeight;
  space?: string;
}>`
  font-size: ${(props) => fontSizeSelector(props.size)};
  color: ${(props) =>
    lighten(
      shallowSelector(props.shallow),
      textColorSelector(props.color, props.theme)
    )};
  max-width: ${(props) => props.maxWidth};
  min-width: ${(props) => props.minWidth};
  padding: 2px 0;
  text-align: ${(props) => props.textAlign};
  font-weight: ${(props) => fontWeightSelector(props.weight)};
  margin: 0;
  text-shadow: ${(props) =>
    props.shadow ? `.5px .5px 1px ${props.theme.shadow}` : "auto"};
  letter-spacing: ${(props) => props.space};
`;

export default P;
