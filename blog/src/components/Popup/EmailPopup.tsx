import { faQq } from "@fortawesome/free-brands-svg-icons";
import { faCopy, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lighten } from "polished";
import React, { useRef } from "react";
import styled from "styled-components";
import { QQ } from "../../shared/info";
import A from "../A";
import Flex from "../Flex";
import Icon from "../Icon";
import P from "../P";
import Popup from "./Popup";
import QRCode from "./QRCode";

const Wrapper = styled.div<{ link?: boolean }>`
  background: ${({ theme }) => lighten(0.1, theme.header)};
  padding: 0.5em;
  margin: 1em 0em;
  border: 0.5px solid ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.background};
  cursor: ${({ link }) => (link ? "pointer" : "initial")};
  &:hover {
    color: ${({ link, theme }) => (link ? theme.blue : "initial")};
  }
`;

const EmailPopup = React.forwardRef(({}, ref: any) => {
  const emailRef = useRef<HTMLDivElement>(null);

  const copyContext = () => {
    if (emailRef.current) {
      const clipboardObj = navigator.clipboard;
      const context = emailRef.current.textContent;
      if (context) clipboardObj.writeText(context);
    }
  };

  return (
    <Popup title="Email(QQ)" ref={ref}>
      <Icon width="64px" src={QQ.icon} alt="QQ 头像" />
      <P size="lg"> {QQ.name} </P>
      <QRCode url={QQ.qr} icon={faQq} />
      <P size="sm" shallow="md">
        请注明来意，非必要不加好友
      </P>
      <Flex>
        <Wrapper>
          <P color="white" ref={emailRef}>
            {QQ.email}
          </P>
        </Wrapper>
        <Wrapper link onClick={copyContext}>
          <FontAwesomeIcon icon={faCopy} title="复制邮箱" />
        </Wrapper>
        <Wrapper link>
          <A color="white" href="mailto:673486387@qq.com">
            <FontAwesomeIcon icon={faEnvelopeOpen} title="QQ邮箱" />
          </A>
        </Wrapper>
      </Flex>
    </Popup>
  );
});

export default EmailPopup;
