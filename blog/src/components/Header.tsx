import { faGithub, faWeixin } from "@fortawesome/free-brands-svg-icons";
import { faEllipsis, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { A } from "./A";
import Flex from "./Flex";
import { Icon } from "./Icon";
import Text from "./Text";

const HeaderWrapper = styled.header`
  display: flex;
  background-color: ${(props) => props.theme.header};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  top: 0;
  padding: 0 1em;
`;

const ContextWrapper = styled(Flex)`
  padding: 1em 2em;
  gap: 1em;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.background_second};
  flex: 1;
`;

const Title = styled(A)`
  color: ${(props) => props.theme.text_reverse};
  font-size: initial;
  font-weight: 600;
  padding: ${(props) => (props.padding ? props.padding : "initial")};
  justify-content: center;
  align-items: center;
`;

export const Header: React.FC = () => {
  return (
    <HeaderWrapper>
      <ContextWrapper>
        <Icon
          border="circle"
          size="24px"
          src="https://avatars.githubusercontent.com/u/70939356?s=16&v=4"
        />
        <Title>
          <Text weight="bold" type="reverse" size="large" wrap={false}>
            Pionpill / gitpage
          </Text>
        </Title>
      </ContextWrapper>
      <ContextWrapper gap="2em">
        <Title padding="0 .5em">Home</Title>
        <Title padding="0 .5em">Article</Title>
        <Title padding="0 .5em">Project</Title>
        <Title padding="0 .5em">Works</Title>
        <Title padding="0 .5em">Other</Title>
      </ContextWrapper>
      <ContextWrapper>
        <Text type="reverse" weight="thin">
          Concat me:
        </Text>
        <Title>
          <FontAwesomeIcon icon={faEnvelope} />
        </Title>
        <Title href="https://github.com/Pionpill">
          <FontAwesomeIcon icon={faGithub} />
        </Title>
        <Title>
          <FontAwesomeIcon icon={faWeixin} />
        </Title>
        <Title>
          <FontAwesomeIcon icon={faEllipsis} />
        </Title>
      </ContextWrapper>
    </HeaderWrapper>
  );
};
