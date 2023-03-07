import styled from "styled-components";
import Degree from "../styles";
import { spacing } from "../styles/measure";
import { gapSelector } from "../utils/styledUtils";

const Main = styled.main<{
  align?: string;
  justify?: string;
  gap?: Degree;
  bleed?: boolean;
}>`
  display: flex;
  align-items: ${({ align }) => (align ? align : "center")};
  background-color: ${({ theme }) => theme.background};
  justify-content: ${({ justify }) => (justify ? justify : "center")};
  padding: ${({ bleed }) =>
    bleed ? `${spacing.hpadding} ${spacing.vpadding}` : 0};
  gap: ${({ gap }) => (gap ? gapSelector(gap) : 0)};
  flex-direction: column;
`;

export default Main;
