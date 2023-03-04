import styled from "styled-components";
import { GapDegree } from "../styles";
import { gapSelector } from "../utils/styledUtils";

export const Main = styled.main<{
  align?: string;
  justify?: string;
  gap?: GapDegree;
}>`
  display: flex;
  align-items: ${({ align }) => (align ? align : "center")};
  justify-content: ${({ justify }) => (justify ? justify : "center")};
  gap: ${({ gap }) => (gap ? gapSelector(gap) : 0)};
  flex-direction: column;
`;
