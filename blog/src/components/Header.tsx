import { faGithub, faWeixin } from "@fortawesome/free-brands-svg-icons";
import { faEllipsis, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import styled from "styled-components";
import { Github } from "../shared/info";
import { togglePopup } from "../utils/toggle";
import { A } from "./A";
import Flex from "./Flex";
import { Icon } from "./Icon";
import P from "./P";
import { EmailPopup } from "./Popup/EmailPopup";
import { WeixinPopup } from "./Popup/WeixinPopup";
import { RouteLink } from "./RouteLink";

const HeaderWrapper = styled.header`
  display: flex;
  background-color: ${(props) => props.theme.header};
  align-items: center;
  justify-content: space-between;
  width: auto;
  top: 0;
  padding: 0 1em;
  z-index: 800;
`;

const ContextWrapper = styled(Flex)<{ hidden?: boolean }>`
  padding: 1em 2em;
  gap: 1em;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.background_second};
  flex: 1;
  @media screen and (max-width: 1080px) {
    display: ${(props) => (props.hidden ? "none" : "auto")};
  }
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
  const emailPopupRef = useRef(null);
  const weixinPopupRef = useRef(null);

  return (
    <>
      <HeaderWrapper>
        <ContextWrapper hidden={true}>
          <Icon border="circle" size="24px" src={Github.icon} />
          <Title>
            <P weight="bold" type="reverse" size="large">
              Pionpill / gitpage
            </P>
          </Title>
        </ContextWrapper>
        <ContextWrapper gap="2em">
          <RouteLink weight="bold" to="/">
            Home
          </RouteLink>
          <RouteLink weight="bold" to="/">
            Article
          </RouteLink>
          <RouteLink weight="bold" to="/">
            Project
          </RouteLink>
          <RouteLink weight="bold" to="/">
            Works
          </RouteLink>
          <RouteLink weight="bold" to="/">
            Other
          </RouteLink>
        </ContextWrapper>
        <ContextWrapper hidden={true}>
          <P type="reverse" weight="thin">
            Concat me:
          </P>
          <Title href={Github.link}>
            <FontAwesomeIcon icon={faGithub} />
          </Title>
          <Title>
            <FontAwesomeIcon
              icon={faWeixin}
              onClick={() => togglePopup(weixinPopupRef)}
            />
          </Title>
          <Title onClick={() => togglePopup(emailPopupRef)}>
            <FontAwesomeIcon icon={faEnvelope} />
          </Title>
          <Title>
            <FontAwesomeIcon icon={faEllipsis} />
          </Title>
        </ContextWrapper>
      </HeaderWrapper>
      <EmailPopup ref={emailPopupRef} />
      <WeixinPopup ref={weixinPopupRef} />
    </>
  );
};
