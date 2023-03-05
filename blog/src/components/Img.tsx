import styled from "styled-components";
import { RadiusType } from "../styles";
import { radiusSelector } from "../utils/styledUtils";

type Props = {
  radius?: RadiusType;
  size?: string;
  height?: string;
};

export const Img = styled.img<Props>`
  width: ${({ size }) => (size ? size : "24px")};
  height: ${({ height }) => (height ? height : "auto")};
  border-radius: ${({ radius }) => radiusSelector(radius)};
  white-space: nowrap;
  object-fit: cover;
  overflow: hidden;
`;
