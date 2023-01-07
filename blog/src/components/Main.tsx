import styled from "styled-components";

export const Main = styled.main<{
  align?: string;
  justify?: string;
  gap?: string;
  column?: boolean;
  reverse?: boolean;
  height?: string;
}>`
  display: flex;
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  gap: ${({ gap }) => (gap ? gap : "initial")};
  flex-direction: ${({ column, reverse }) =>
    reverse
      ? column
        ? "column-reverse"
        : "row-reverse"
      : column
      ? "column"
      : "row"};
  height: ${(props) => (props.height ? props.height : "initial")};
`;
