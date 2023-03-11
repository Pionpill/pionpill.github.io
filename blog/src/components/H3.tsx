import { darken, lighten } from "polished";
import styled, { CSSProperties } from "styled-components";
import Degree, { TextColor } from "../styles";
import { spacing } from "../styles/measure";
import { fontWeight } from "../styles/size";
import { light } from "../styles/themes";
import { shallowSelector, textColorSelector } from "../utils/styledUtils";

const H3 = styled.h3<{
  shallow?: Degree;
  color?: TextColor;
  space?: CSSProperties["letterSpacing"];
}>`
  color: ${({ shallow, color, theme }) =>
    theme === light
      ? lighten(shallowSelector(shallow), textColorSelector(color, theme))
      : darken(shallowSelector(shallow), textColorSelector(color, theme))};
  font-weight: ${() => fontWeight.xxl};
  font-size: 28px;
  letter-spacing: 2px;
  text-align: center;
  margin: 0;
  padding: ${() => spacing.font} 0;
  text-shadow: 1px 1px 0.5px ${({ theme }) => theme.shadow};
  letter-spacing: ${({ space }) => space};
`;

export default H3;
