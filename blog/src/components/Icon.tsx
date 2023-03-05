import styled from "styled-components";
import { RadiusType } from "../styles";
import { radiusSelector } from "../utils/styledUtils";

type Props = {
  radius?: RadiusType;
  width?: string;
  height?: string;
};

const Icon = styled.img<Props>`
  width: ${({ width }) => (width ? width : "24px")};
  height: ${({ height, width }) => (height ? height : width ? width : "24px")};
  border-radius: ${({ radius }) =>
    radius ? radiusSelector(radius) : radiusSelector("circle")};
  white-space: nowrap;
`;

export default Icon;
