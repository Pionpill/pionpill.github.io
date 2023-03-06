import { ReactNode } from "react";
import styled, { CSSProperties } from "styled-components";
import Flex from "./Flex";

const RealAbsolute = styled(Flex)<{
  x?: CSSProperties["left"];
  y?: CSSProperties["bottom"];
}>`
  position: absolute;
  left: ${({ x }) => x};
  bottom: ${({ y }) => y};
`;

const Absolute: React.FC<{
  x?: CSSProperties["left"];
  y?: CSSProperties["bottom"];
  children?: ReactNode;
}> = ({ x, y, children }) => {
  return (
    <RealAbsolute x={x} y={y}>
      <Flex style={{ position: "absolute" }}>{children}</Flex>
    </RealAbsolute>
  );
};

export default Absolute;
