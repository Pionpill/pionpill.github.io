import styled from "styled-components";
import Flex from "../../../components/Flex";

export const Wrapper = styled(Flex)`
  justify-content: center;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.text_reverse};
  gap: 50px;
  padding: 1em 5%;
  flex-direction: column;
`;
