import { darken, lighten } from "polished";
import styled, { CSSProperties } from "styled-components";
import Degree, { TextColor } from "../styles";
import { common, light } from "../styles/themes";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  size?: Degree;
  color?: TextColor | "blue" | "link";
  shallow?: Degree;
  weight?: Degree;
  inline?: boolean;
  wrap?: boolean;
  align?: CSSProperties["textAlign"];
};

const A = styled.a<Props>`
  color: ${({ shallow, color, theme }) =>
    theme === light
      ? lighten(
          shallowSelector(shallow),
          color === "blue"
            ? common.pointer
            : color === "link"
            ? common.link
            : textColorSelector(color, theme)
        )
      : darken(
          shallowSelector(shallow),
          color === "blue"
            ? common.pointer
            : color === "link"
            ? common.link
            : textColorSelector(color, theme)
        )};
  font-size: ${({ size }) => (size ? fontSizeSelector(size) : "inherit")};
  font-weight: ${({ weight }) =>
    weight ? fontWeightSelector(weight) : "inherit"};
  margin: 0;
  padding: ${({ inline }) => (inline ? "4px 4px" : "4px 0")};
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
