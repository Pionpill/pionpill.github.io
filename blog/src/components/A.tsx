import { lighten } from "polished";
import styled, { CSSProperties } from "styled-components";
import { FontSize, FontWeight, ShallowDegree, TextColor } from "../styles";
import { common } from "../styles/themes";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  size?: FontSize;
  color?: TextColor | "blue" | "link";
  shallow?: ShallowDegree;
  weight?: FontWeight;
  wrap?: boolean;
  align?: CSSProperties["textAlign"];
};

const A = styled.a<Props>`
  color: ${({ shallow, color, theme }) =>
    lighten(
      shallowSelector(shallow),
      color === "blue"
        ? common.pointer
        : color === "link"
        ? common.link
        : textColorSelector(color, theme)
    )};
  font-size: ${({ size }) => fontSizeSelector(size)};
  font-weight: ${({ weight }) => fontWeightSelector(weight)};
  margin: 0;
  padding: 4px 0;
  cursor: pointer;
  white-space: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
  justify-content: center;
  align-items: center;
  text-align: ${({ align }) => align};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.blue};
    /* transition: all 0.5s; */
  }
  display: inline;
`;

export default A;
