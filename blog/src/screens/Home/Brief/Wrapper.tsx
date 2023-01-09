import styled from "styled-components";
import Flex from "../../../components/Flex";

export const ContextWrapper = styled(Flex)`
  padding: 1em;
  width: 100%;
  gap: 5%;
  @media screen and (max-width: 1080px) {
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }
`;

export const ImgWrapper = styled(Flex)`
  flex-direction: column;
  gap: 1em;
  width: 25%;
  align-items: center;
  @media screen and (max-width: 1080px) {
    width: 75%;
  }
`;

export const TextWrapper = styled(Flex)`
  flex-direction: column;
  width: 70%;
  @media screen and (max-width: 1080px) {
    width: 95%;
    align-items: center;
  }
`;

export const Wrapper = styled(Flex)`
  justify-content: center;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.text_reverse};
  gap: 50px;
  padding: 1em 5%;
  flex-direction: column;
`;
