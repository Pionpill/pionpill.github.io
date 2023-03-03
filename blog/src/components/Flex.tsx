import styled, { css, CSSProperties } from "styled-components";

type Props = {
  wrap?: boolean;
  column?: boolean;
  reverse?: boolean;
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  gap?: CSSProperties["gap"];
  position?: CSSProperties["position"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  full?: boolean;
  zIndex?: CSSProperties["zIndex"];
};

const Flex = styled.div<Props>`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? "wrap" : "nowrap")};
  flex-direction: ${({ column, reverse }) =>
    reverse
      ? column
        ? "column-reverse"
        : "row-reverse"
      : column
      ? "column"
      : "row"};
  justify-content: ${(props) => (props.justify ? props.justify : "center")};
  align-items: ${(props) => (props.align ? props.align : "center")};
  gap: ${(props) => props.gap};
  z-index: ${(props) => props.zIndex};
  position: ${(props) => props.position};
  ${(props) =>
    props.full &&
    css`
      width: 100vw;
      height: 100vh;
    `}
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export default Flex;
