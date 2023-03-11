import styled from "styled-components";
import Degree, { ButtonColor, RadiusType, TextColor } from "../styles";
import { common } from "../styles/themes";
import {
  buttonColorSelector,
  fontSizeSelector,
  radiusSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  color?: ButtonColor;
  size?: Degree;
  textColor?: TextColor;
  radius?: RadiusType;
};
const Brand = styled.span<Props>`
  border-radius: ${({ radius }) =>
    radius ? radiusSelector(radius) : radiusSelector("xs")};
  padding: 3px 5px;
  font-size: ${({ size }) =>
    size ? fontSizeSelector(size) : fontSizeSelector("xs")};
  text-shadow: 0.5px 0.75px ${({ theme }) => theme.shadow};
  color: ${({ textColor, theme }) =>
    textColor ? textColorSelector(textColor, theme) : common.text_white};
  background-color: ${({ color }) => buttonColorSelector(color)};
`;

export default Brand;
