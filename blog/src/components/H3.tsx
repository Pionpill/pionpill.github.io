import { lighten } from "polished";
import styled from "styled-components";
import { ShallowDegree, TextColor } from "../styles";
import { fontWeight } from "../styles/size";
import { spacing } from "../styles/spacing";
import { shallowSelector, textColorSelector } from "../utils/styledUtils";

const H3 = styled.h3<{
  shallow?: ShallowDegree;
  color?: TextColor;
}>`
  color: ${(props) =>
    lighten(
      shallowSelector(props.shallow),
      textColorSelector(props.color, props.theme)
    )};
  font-weight: ${() => fontWeight.xxl};
  font-size: 28px;
  text-align: center;
  margin: 0;
  padding: ${() => spacing.font} 0;
  text-shadow: 1px 1px 0.5px ${(props) => props.theme.shadow};
`;

export default H3;
