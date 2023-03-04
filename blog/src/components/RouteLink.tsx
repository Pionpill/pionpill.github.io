import { lighten } from "polished";
import { Link } from "react-router-dom";
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
  shallow?: ShallowDegree;
  size?: FontSize;
  weight?: FontWeight;
};

const RouteLink = styled(Link)<Props>`
  color: ${(props) =>
    lighten(
      shallowSelector(props.shallow),
      props.color === "blue"
        ? common.pointer
        : props.color === "link"
        ? common.link
        : textColorSelector(props.color, props.theme)
    )};
  font-size: initial;
  font-weight: 400;
  padding: 0.5em 0.75em;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: ${(props) => fontSizeSelector(props.size)};
  font-weight: ${(props) => fontWeightSelector(props.weight)};
  &:hover {
    color: ${(props) => props.theme.blue};
    transition: all 0.5s;
  }
`;

export default RouteLink;
