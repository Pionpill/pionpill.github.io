import { styled } from "@mui/material";
import { CSSProperties } from "react";
import FlexBox from "./FlexBox";

const Absolute = styled(FlexBox)<{
  x?: CSSProperties["left"];
  y?: CSSProperties["bottom"];
}>`
  position: absolute;
  left: ${({ x }) => (x ? x : "inherit")};
  top: ${({ y }) => (y ? y : "inherit")};
  transform: translate(-50%, -50%);
`;

export default Absolute;
