import styled from "styled-components";
import { spacing } from "../styles/spacing";
import Flex from "./Flex";

export const Card = styled(Flex)`
  background-color: ${(props) => props.theme.background};
  padding: ${() => spacing.padding};
`;
