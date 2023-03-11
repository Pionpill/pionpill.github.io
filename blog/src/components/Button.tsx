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
  textColor?: TextColor | "blue" | "link";
  shallow?: Degree;
  weight?: Degree;
};

const Button = styled.button<Props>`
  color: ${({ textColor, theme }) =>
    textColor
      ? textColor === "blue"
        ? common.pointer
        : textColor === "link"
        ? common.link
        : textColorSelector(textColor, theme)
      : common.text_white};
  background-color: ${({ theme, shallow, bgColor }) =>
    theme === light
      ? lighten(
          shallowSelector(shallow),
          bgColor ? buttonColorSelector(bgColor) : "transparent"
        )
      : darken(
          shallowSelector(shallow),
          bgColor ? buttonColorSelector(bgColor) : "transparent"
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
      lighten(
        shallowSelector("sm"),
        textColor
          ? textColor
            ? textColor === "blue"
              ? common.pointer
              : textColor === "link"
              ? common.link
              : textColorSelector(textColor, theme)
            : common.text_white
          : common.text_white
      )};
    /* transition: all 0.5s; */
  }
  display: inline;
`;

export default Button;
