import styled from "styled-components";
import Flex from "./Flex";

type Props = {
  width?: string;
  height?: string;
};

const Board = styled(Flex)<Props>`
  position: relative;
  max-width: ${({ width }) => width};
  max-height: ${({ height }) => height};
  min-width: ${({ width }) => width};
  min-height: ${({ height }) => height};
`;

export default Board;
