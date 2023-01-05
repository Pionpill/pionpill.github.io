import styled from "styled-components";
import { A } from "../../components/A";
import Flex from "../../components/Flex";

const Title = styled(A)`
  color: ${(props) => props.theme.text_reverse};
  font-size: initial;
  font-weight: 400;
  padding: 0.5em 0.75em;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${(props) => props.theme.main};
    transition: all 0.5s;
  }
`;

const Wrapper = styled(Flex)`
  background-color: ${(props) => props.theme.assist};
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

export const Menu: React.FC = () => {
  return (
    <Wrapper>
      <Title> Brief (简介) </Title>
      <Title> Experience (经历) </Title>
      <Title> Skill (技能) </Title>
    </Wrapper>
  );
};
