import styled from "styled-components";
import Flex from "../../components/Flex";
import P from "../../components/P";

const Wrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.text_reverse};
`;

export const Brief: React.FC = () => {
  return (
    <Wrapper>
      <P type="reverse">123</P>
      <P type="reverse">456</P>
    </Wrapper>
  );
};
