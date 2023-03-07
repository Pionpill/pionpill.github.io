import styled, { CSSProperties } from "styled-components";
import Flex from "./Flex";

const Absolute = styled(Flex)<{
  x?: CSSProperties["left"];
  y?: CSSProperties["bottom"];
}>`
  position: absolute;
  left: ${({ x }) => (x ? x : "inherit")};
  bottom: ${({ y }) => (y ? y : "inherit")};
  transform: translateX(-50%) translateY(50%);
`;

export default Absolute;
