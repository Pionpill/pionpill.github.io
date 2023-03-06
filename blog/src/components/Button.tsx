import { darken, lighten } from "polished";
import styled from "styled-components";
import {
  ButtonColor,
  FontSize,
  FontWeight,
  ShallowDegree,
  TextColor,
} from "../styles";
import { common } from "../styles/themes";
import {
  buttonColorSelector,
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  bgColor?: ButtonColor;
  size?: FontSize;
  textColor?: TextColor;
  shallow?: ShallowDegree;
  weight?: FontWeight;
};

const Button = styled.button<Props>`
  color: ${({ textColor, theme }) =>
    textColor ? textColorSelector(textColor, theme) : common.text_white};
  background-color: ${({ shallow, bgColor: color }) =>
    lighten(
      shallowSelector(shallow),
      color ? buttonColorSelector(color) : "transparent"
    )};
  font-size: ${({ size }) => fontSizeSelector(size)};
  font-weight: ${({ weight }) => fontWeightSelector(weight)};
  margin: 0;
  padding: 4px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border: 0;
  &:hover {
    color: ${({ textColor, theme }) =>
      darken(
        shallowSelector("sm"),
        textColor ? textColorSelector(textColor, theme) : common.text_white
      )};
    /* transition: all 0.5s; */
  }
  display: inline;
`;

export default Button;
