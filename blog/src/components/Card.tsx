import styled, { CSSProperties } from "styled-components";
import { radiusSelector } from "../utils/styledUtils";
import Flex from "./Flex";

type Props = {
  cursor?: CSSProperties["cursor"];
  radius?: CSSProperties["borderRadius"];
  padding?: CSSProperties["padding"];
  bg?: CSSProperties["background"];
  bgColor?: CSSProperties["backgroundColor"];
};

const Card = styled(Flex)<Props>`
  cursor: ${({ cursor }) => cursor};
  background-color: ${({ bgColor }) => bgColor};
  background: ${({ bg }) => bg};
  border-radius: ${({ radius }) => {
    return radius ? radiusSelector(radius) : radiusSelector("xs");
  }};
  padding: ${({ padding }) => (padding ? padding : "6px")};
`;

export default Card;
