import styled from "styled-components";
import { RadiusType } from "../styles";
import { radiusSelector } from "../utils/styledUtils";

type Props = {
  radius?: RadiusType;
  size?: string;
  height?: string;
  clip?: string;
};

export const Img = styled.img<Props>`
  width: ${(props) => (props.size ? props.size : "24px")};
  height: ${(props) => (props.height ? props.height : "auto")};
  border-radius: ${(props) => radiusSelector(props.radius)};
  white-space: nowrap;
  object-fit: cover;
  overflow: hidden;
`;
