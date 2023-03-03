import styled from "styled-components";
import { RadiusType } from "../styles";
import { radiusSelector } from "../utils/styledUtils";

type Props = {
  radius?: RadiusType;
  width?: string;
  height?: string;
};

const Icon = styled.img<Props>`
  width: ${(props) => (props.width ? props.width : "24px")};
  height: ${(props) =>
    props.height ? props.height : props.width ? props.width : "24px"};
  border-radius: ${(props) =>
    props.radius ? radiusSelector(props.radius) : radiusSelector("circle")};
  white-space: nowrap;
`;

export default Icon;
