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
  color: ${(props) =>
    lighten(
      shallowSelector(props.shallow),
      props.color === "blue"
        ? common.pointer
        : props.color === "link"
        ? common.link
        : textColorSelector(props.color, props.theme)
    )};
  font-size: ${(props) => fontSizeSelector(props.size)};
  font-weight: ${(props) => fontWeightSelector(props.weight)};
  margin: 0;
  cursor: pointer;
  white-space: ${(props) => (props.wrap ? "wrap" : "nowrap")};
  justify-content: center;
  align-items: center;
  text-align: ${(props) => props.align};
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.blue};
    /* transition: all 0.5s; */
  }
  display: inline;
`;

export default A;
