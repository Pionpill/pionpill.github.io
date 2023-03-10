import { darken, lighten } from "polished";
import styled from "styled-components";
import Degree, { ButtonColor, TextColor } from "../styles";
import { common, light } from "../styles/themes";
import {
  buttonColorSelector,
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  bgColor?: ButtonColor;
  size?: Degree;
  textColor?: TextColor;
  shallow?: Degree;
  weight?: Degree;
};

const Button = styled.button<Props>`
  color: ${({ textColor, theme }) =>
    textColor ? textColorSelector(textColor, theme) : common.text_white};
  background-color: ${({ theme, shallow, bgColor: color }) =>
    theme === light
      ? lighten(
          shallowSelector(shallow),
          color ? buttonColorSelector(color) : "transparent"
        )
      : darken(
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
