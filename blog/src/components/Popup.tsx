import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lighten } from "polished";
import styled from "styled-components";
import { A } from "./A";
import Flex from "./Flex";
import Text from "./Text";
type FixedProps = {
  width?: string;
  height?: string;
};

const Fixed = styled(Flex)<FixedProps>`
  position: fixed;
  width: ${(props) => (props.width ? props.width : "300px")};
  height: ${(props) => (props.height ? props.height : "500px")};
  border-radius: 0.5em;
  background-color: ${(props) => props.theme.background};
  box-shadow: 0 0 5px 3px ${(props) => props.theme.shadow};
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Curtain = styled(Fixed)`
  width: 100%;
  height: 100%;
  background: ${(props) => lighten(0.1, props.theme.text)};
`;

const Header = styled(Flex)`
  height: 36px;
  width: 100%;
  background: ${(props) => props.theme.header};
  color: ${(props) => props.theme.text_reverse};
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 6px 6px 0px 0px;
  padding: 0 1em;
`;

const Title = styled(Text)`
  margin-left: auto;
`;

const CloseIcon = styled(A)`
  color: ${(props) => props.theme.text_reverse};
  margin-left: auto;
`;

type Props = {
  title: string;
  children?: any;
};

export const Popup: React.FC<Props> = ({ title, children, ...rest }) => {
  return (
    <>
      <Curtain {...rest} />
      <Fixed>
        <Header>
          <Title type="reverse" weight="bold">
            {title}
          </Title>
          <CloseIcon>
            <FontAwesomeIcon icon={faXmark} />
          </CloseIcon>
        </Header>
        {children}
      </Fixed>
    </>
  );
};
