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
  font-size: ${({ size }) =>
    size ? fontSizeSelector(size) : fontSizeSelector("xs")};
  text-shadow: 0.5px 0.75px ${({ theme }) => theme.shadow};
  color: ${({ textColor, theme }) =>
    textColor ? textColorSelector(textColor, theme) : common.text_white};
  background-color: ${({ color }) => buttonColorSelector(color)};
`;

export default Brand;
