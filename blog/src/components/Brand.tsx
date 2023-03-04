import styled from "styled-components";
import { ButtonColor, FontSize, TextColor } from "../styles";
import { common } from "../styles/themes";
import {
  buttonColorSelector,
  fontSizeSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  color?: ButtonColor;
  size?: FontSize;
  textColor?: TextColor;
};
const Brand = styled.span<Props>`
  border-radius: 10%;
  padding: 3px 5px;
  font-size: ${(props) =>
    props.size ? fontSizeSelector(props.size) : fontSizeSelector("xs")};
  text-shadow: 1px 0px ${(props) => props.theme.text};
  color: ${(props) =>
    props.textColor
      ? textColorSelector(props.textColor, props.theme)
      : common.text_white};
  background-color: ${(props) => buttonColorSelector(props.color)};
`;

export default Brand;
