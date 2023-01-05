import styled from "styled-components";

export const Main = styled.main<{
  align?: string;
  justify?: string;
  gap?: string;
}>`
  display: flex;
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  gap: ${({ gap }) => (gap ? gap : "initial")};
`;
