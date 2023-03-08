import { lighten } from "polished";
import styled from "styled-components";
import Degree, { TextColor } from "../styles";
import { spacing } from "../styles/measure";
import { fontWeight } from "../styles/size";
import { shallowSelector, textColorSelector } from "../utils/styledUtils";

const H2 = styled.h2<{
  shallow?: Degree;
  color?: TextColor;
}>`
  color: ${({ shallow, color, theme }) =>
    lighten(shallowSelector(shallow), textColorSelector(color, theme))};
  font-weight: ${() => fontWeight.xxl};
  font-size: 32px;
  letter-spacing: 2px;
  text-align: center;
  margin: 0;
  padding: ${() => spacing.font} 0;
  text-shadow: 1px 1px 0.5px ${({ theme }) => theme.shadow};
`;

export default H2;
