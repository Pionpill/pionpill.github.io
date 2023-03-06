import styled, { css } from "styled-components";
import { breakpoints } from "../styles/measure";

type Props = {
  phoneHidden?: boolean;
  tabletHidden?: boolean;
  phoneShow?: boolean;
  tabletShow?: boolean;
  tabletShowOnly?: boolean;
};

const Responsive = styled.div<Props>`
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
  ${({ tabletShow }) =>
    tabletShow &&
    css`
      @media screen and (min-width: ${breakpoints.tablet}) {
        display: none;
      }
    `}
  ${({ phoneShow }) =>
    phoneShow &&
    css`
      @media screen and (min-width: ${breakpoints.phone}) {
        display: none;
      }
    `}
`;

export default Responsive;
