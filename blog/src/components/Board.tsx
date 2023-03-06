import styled from "styled-components";
import Flex from "./Flex";

// TODO
const Board = styled(Flex)<{ width?: string; height?: string }>`
  position: relative;
`;

export default Board;
