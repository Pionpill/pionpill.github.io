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
  width: 30%;
  height: 100%;
  max-height: 500px;
  align-items: center;
  @media screen and (max-width: 1080px) {
    width: 100%;
    height: 200px;
    flex-direction: row;
  }
`;

export const TextWrapper = styled(Flex)`
  flex-direction: column;
  width: auto;
  @media screen and (max-width: 1080px) {
    width: 95%;
    align-items: center;
  }
`;
