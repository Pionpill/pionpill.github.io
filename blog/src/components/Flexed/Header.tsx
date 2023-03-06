import { faGithub, faWeixin } from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faEllipsis,
  faEnvelope,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useThemeChoice } from "../../hooks/useThemeChoice";
import { Github } from "../../shared/info";
import { toggleTheme } from "../../store/root";
import { toggleComponent } from "../../utils/componentsUtils";
import { isPhone } from "../../utils/responsiveUtils";
import A from "../A";
import Button from "../Button";
import Flex from "../Flex";
import Icon from "../Icon";
import P from "../P";
import EmailPopup from "../Popup/EmailPopup";
import WeixinPopup from "../Popup/WeixinPopup";
import Responsive from "../Responsive";
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

  const ThemeLinks: React.FC = () => {
    const themeIcon = useThemeChoice(faSun, faMoon);
    const dispatch = useDispatch();

    return (
      <>
        <Button>
          <FontAwesomeIcon
            icon={themeIcon}
            onClick={() => dispatch(toggleTheme())}
          />
        </Button>
      </>
    );
  };

  const ContactLinks: React.FC = () => {
    return (
      <>
        <A href={Github.link} color="white">
          <FontAwesomeIcon icon={faGithub} />
        </A>
        <Button style={{ padding: 0 }}>
          <FontAwesomeIcon
            icon={faWeixin}
            onClick={() => toggleComponent(weixinPopupRef)}
          />
        </Button>
        <Button
          style={{ padding: 0 }}
          onClick={() => toggleComponent(emailPopupRef)}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </Button>
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
          <Responsive tabletHidden>
            <Icon radius="circle" width="24px" src={Github.icon} />
          </Responsive>
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
              <ThemeLinks />
              <Responsive tabletHidden>
                <P weight="sm" color="white">
                  Concat Me:
                </P>
              </Responsive>
              <Responsive tabletShow>
                <P weight="sm" color="white">
                  |
                </P>
              </Responsive>
              <ContactLinks />
            </Flex>
          </>
        )}
        {isPhone() && (
          <>
            <ThemeLinks />
            <Button weight="sm" onClick={() => toggleComponent(contactBarRef)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </Button>
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
