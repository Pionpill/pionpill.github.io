import { lighten } from "polished";
import styled, { css, CSSProperties } from "styled-components";
import { GapDegree, RadiusType, ShallowDegree } from "../styles";
import { breakpoints, spacing } from "../styles/measure";
import { common } from "../styles/themes";
import {
  gapSelector,
  radiusSelector,
  shallowSelector,
} from "../utils/styledUtils";

type Props = {
  wrap?: boolean;
  column?: boolean;
  reverse?: boolean;
  black?: boolean;
  shallow?: ShallowDegree;
  full?: boolean;
  bleed?: boolean;
  gap?: GapDegree;
  phoneResponsive?: boolean;
  tabletResponsive?: boolean;
  phoneHidden?: boolean;
  tabletHidden?: boolean;
  shadow?: boolean;
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  padding?: CSSProperties["padding"];
  radius?: RadiusType;
};

const Flex = styled.div<Props>`
  display: flex;
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
  flex: 1;
  padding: ${({ bleed, padding }) =>
    padding
      ? padding
      : bleed
      ? `${spacing.hpadding} ${spacing.vpadding}`
      : "auto"};
  gap: ${({ gap }) => gapSelector(gap)};
  background-color: ${({ shallow, black }) =>
    lighten(shallowSelector(shallow), black ? common.header : "transparent")};
  flex-direction: ${({ column, reverse }) =>
    reverse
      ? column
        ? "column-reverse"
        : "row-reverse"
      : column
      ? "column"
      : "row"};
  justify-content: ${({ justify }) => (justify ? justify : "center")};
  align-items: ${({ align }) => (align ? align : "center")};
  border-radius: ${({ radius }) => {
    return radius ? radiusSelector(radius) : "initial";
  }};
  ${({ shadow }) =>
    shadow &&
    css`
      box-shadow: 0.5px 0.75px 2px ${({ theme }) => theme.shadow};
    `}

  ${({ full }) =>
    full &&
    css`
      width: calc(100vw - 50px);
      height: 100vh;
    `}
  ${({ tabletResponsive }) =>
    tabletResponsive &&
    css`
      @media screen and (max-width: ${breakpoints.tablet}) {
        flex-direction: column;
      }
    `}
  ${({ phoneResponsive }) =>
    phoneResponsive &&
    css`
      @media screen and (max-width: ${breakpoints.phone}) {
        flex-direction: column;
      }
    `}
  ${({ tabletHidden }) =>
    tabletHidden &&
    css`
      @media screen and (max-width: ${breakpoints.tablet}) {
        display: none;
      }
    `}
  ${({ phoneHidden }) =>
    phoneHidden &&
    css`
      @media screen and (max-width: ${breakpoints.phone}) {
        display: none;
      }
    `}
`;

export default Flex;
