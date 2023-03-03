import { lighten } from "polished";
import styled from "styled-components";
import { ShallowDegree, TextColor } from "../styles";
import { fontSize, fontWeight } from "../styles/size";
import { spacing } from "../styles/spacing";
import { shallowSelector, textColorSelector } from "../utils/styledUtils";

export const H1 = styled.h1<{
  shallow?: ShallowDegree;
  color: TextColor;
}>`
  color: ${(props) =>
    lighten(
      shallowSelector(props.shallow),
      textColorSelector(props.color, props.theme)
    )};
  font-weight: ${() => fontWeight.xxl};
  font-size: ${() => fontSize.h1};
  text-align: center;
  margin: 0;
  padding: ${() => spacing.font} 0;
  text-shadow: 1px 1px 1px ${(props) => props.theme.shadow};
`;
