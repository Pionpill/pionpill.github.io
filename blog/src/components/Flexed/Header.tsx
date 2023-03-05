import { faGithub, faWeixin } from "@fortawesome/free-brands-svg-icons";
import { faBars, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { Github } from "../../shared/info";
import { toggleComponent } from "../../utils/componentsUtils";
import { isPhone } from "../../utils/responsiveUtils";
import A from "../A";
import Flex from "../Flex";
import Icon from "../Icon";
import P from "../P";
import EmailPopup from "../Popup/EmailPopup";
import WeixinPopup from "../Popup/WeixinPopup";
import RouteLink from "../RouteLink";

const HeaderWrapper = styled.header`
  display: flex;
  background-color: ${({ theme }) => theme.header};
  align-items: center;
  justify-content: space-around;
  height: 50px;
  top: 0;
  z-index: 800;
  padding: 0 1em;
  position: sticky;
`;

export const Header: React.FC = () => {
  const emailPopupRef = React.useRef(null);
  const weixinPopupRef = React.useRef(null);
  const routeBarRef = React.useRef(null);
  const contactBarRef = React.useRef(null);

  const RouteLinks: React.FC = () => {
    return (
      <>
        <RouteLink color="white" weight="xl" to="/">
          Home
        </RouteLink>
        <RouteLink color="white" weight="xl" to="/">
          Article
        </RouteLink>
        <RouteLink color="white" weight="xl" to="/">
          Project
        </RouteLink>
        <RouteLink color="white" weight="xl" to="/">
          Works
        </RouteLink>
        <RouteLink color="white" weight="xl" to="/">
          Other
        </RouteLink>
      </>
    );
  };
  const ContactLinks: React.FC = () => {
    return (
      <>
        <A href={Github.link} color="white">
          <FontAwesomeIcon icon={faGithub} />
        </A>
        <A color="white">
          <FontAwesomeIcon
            icon={faWeixin}
            onClick={() => toggleComponent(weixinPopupRef)}
          />
        </A>
        <A color="white" onClick={() => toggleComponent(emailPopupRef)}>
          <FontAwesomeIcon icon={faEnvelope} />
        </A>
      </>
    );
  };

  return (
    <>
      <HeaderWrapper id="header">
        {isPhone() && (
          <>
            <A color="white" onClick={() => toggleComponent(routeBarRef)}>
              <FontAwesomeIcon icon={faBars} />
            </A>
            <Flex
              ref={routeBarRef}
              gap="md"
              black
              shallow="xs"
              style={{
                display: "none",
                position: "absolute",
                bottom: "-40px",
                width: "100% ",
                height: "40px",
              }}
            >
              <RouteLinks />
            </Flex>
            ;
          </>
        )}
        <Flex>
          <Icon radius="circle" width="24px" src={Github.icon} />
          <RouteLink color="white" weight="xl" size="lg" to="/">
            Pionpill / gitpage
          </RouteLink>
        </Flex>
        {!isPhone() && (
          <>
            <Flex gap="md">
              <RouteLinks />
            </Flex>
            <Flex gap="md">
              <P weight="sm" color="white">
                Concat Me:
              </P>
              <ContactLinks />
            </Flex>
          </>
        )}
        {isPhone() && (
          <>
            <A
              color="white"
              weight="sm"
              onClick={() => toggleComponent(contactBarRef)}
            >
              Concat Me
            </A>
            <Flex
              ref={contactBarRef}
              gap="md"
              black
              style={{
                display: "none",
                height: "25px",
                width: "100px",
                position: "absolute",
                bottom: "-25px",
                right: "0",
              }}
            >
              <ContactLinks />
            </Flex>
          </>
        )}
      </HeaderWrapper>
      <EmailPopup ref={emailPopupRef} />
      <WeixinPopup ref={weixinPopupRef} />
    </>
  );
};
