import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lighten } from "polished";
import React from "react";
import styled from "styled-components";
import { togglePopup } from "../../utils/toggleUtils";
import A from "../A";
import Flex from "../Flex";
import P from "../P";
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
  flex-direction: column;
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
`;

const CloseIcon = styled(A)`
  position: absolute;
  top: 4px;
  right: 0px;
  color: ${(props) => props.theme.text_reverse};
  margin-left: auto;
  padding-right: 1em;
`;

const Wrapper = styled.div`
  display: none;
`;

const ContextWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 1em 1em;
  width: 100%;
  height: 100%;
  justify-content: space-around;
`;

type Props = {
  title: string;
  children?: any;
};

const Popup = React.forwardRef(
  ({ title, children, ...rest }: Props, ref: any) => {
    return (
      <Wrapper ref={ref}>
        <Curtain {...rest} />
        <Fixed align="center" gap=".5em">
          <Header>
            <P weight="xl" color="white">
              {title}
            </P>
          </Header>
          <CloseIcon onClick={() => togglePopup(ref)}>
            <FontAwesomeIcon icon={faXmark} />
          </CloseIcon>
          <ContextWrapper>{children}</ContextWrapper>
        </Fixed>
      </Wrapper>
    );
  }
);

export default Popup;
