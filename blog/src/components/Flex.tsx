import { lighten } from "polished";
import styled, { css, CSSProperties } from "styled-components";
import { GapDegree, ShallowDegree } from "../styles";
import breakpoints from "../styles/breakpoints";
import { common } from "../styles/themes";
import { gapSelector, shallowSelector } from "../utils/styledUtils";

type Props = {
  wrap?: boolean;
  column?: boolean;
  reverse?: boolean;
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  black?: boolean;
  shallow?: ShallowDegree;
  full?: boolean;
  gap?: GapDegree;
  padding?: CSSProperties["padding"];
  responsive?: Boolean;
};

const Flex = styled.div<Props>`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? "wrap" : "nowrap")};
  flex: 1;
  padding: ${(props) => (props.padding ? props.padding : "auto")};
  gap: ${(props) => gapSelector(props.gap)};
  background-color: ${(props) =>
    lighten(
      shallowSelector(props.shallow),
      props.black ? common.header : "transparent"
    )};
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
  ${(props) =>
    props.full &&
    css`
      width: calc(100vw - 50px);
      height: 100vh;
    `}
  ${(props) =>
    props.responsive &&
    css`
      @media screen and (max-width: ${breakpoints.phone}) {
        flex-direction: column;
      }
    `}
`;

export default Flex;
