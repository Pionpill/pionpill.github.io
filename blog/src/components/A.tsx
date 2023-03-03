import { lighten } from "polished";
import styled from "styled-components";
import { FontSize, FontWeight, ShallowDegree, TextColor } from "../styles";
import { common } from "../styles/themes";
import {
  fontSizeSelector,
  fontWeightSelector,
  shallowSelector,
  textColorSelector,
} from "../utils/styledUtils";

type Props = {
  color?: TextColor | "blue" | "link";
  size?: FontSize;
  shallow?: ShallowDegree;
  weight?: FontWeight;
  padding?: string;
  margin?: string;
  wrap?: boolean;
  align?: string;
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
  padding: ${(props) => (props.padding ? props.padding : "initial")};
  margin: ${(props) => (props.margin ? props.margin : "initial")};
  cursor: pointer;
  white-space: ${(props) => (props.wrap ? "wrap" : "nowrap")};
  justify-content: center;
  align-items: center;
  text-align: ${(props) => props.align};
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.blue};
    text-decoration: underline;
    /* transition: all 0.5s; */
  }
  display: inline;
`;

export default A;
