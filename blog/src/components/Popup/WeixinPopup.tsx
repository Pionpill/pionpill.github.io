import { faQq } from "@fortawesome/free-brands-svg-icons";
import { faCopy, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lighten } from "polished";
import { useRef } from "react";
import styled from "styled-components";
import { QQ, Weixin } from "../../shared/info";
import { A } from "../A";
import Flex from "../Flex";
import { Icon } from "../Icon";
import P from "../Text";
import { Popup } from "./Popup";
import { QRCode } from "./QRCode";

const Wrapper = styled.div<{ link?: boolean }>`
  background: ${(props) => lighten(0.1, props.theme.header)};
  padding: 0.5em;
  margin: 1em 0em;
  border: 0.5px solid ${(props) => props.theme.background};
  color: ${(props) => props.theme.background};
  cursor: ${(props) => (props.link ? "pointer" : "initial")};
  &:hover {
    color: ${(props) => (props.link ? props.theme.blue : "initial")};
  }
`;

export const WeixinPopup: React.FC = () => {
  const emailRef = useRef<HTMLDivElement>(null);

  const copyContext = () => {
    if (emailRef.current) {
      const clipboardObj = navigator.clipboard;
      const context = emailRef.current.textContent;
      if (context) clipboardObj.writeText(context);
    }
  };

  return (
    <Popup title="Weixin">
      <Icon size="64px" src={QQ.icon} border="circle" />
      <P size="large"> {Weixin.name} </P>
      <QRCode url={Weixin.qr} icon={faQq} />
      <P size="small" type="third">
        请注明来意，非必要不加好友
      </P>
      <Flex>
        <Wrapper>
          <P type="reverse" ref={emailRef}>
            {QQ.email}
          </P>
        </Wrapper>
        <Wrapper link={true} onClick={copyContext}>
          <FontAwesomeIcon icon={faCopy} title="复制邮箱" />
        </Wrapper>
        <Wrapper link={true}>
          <A type="reverse" href="https://mail.qq.com/">
            <FontAwesomeIcon icon={faEnvelopeOpen} title="QQ邮箱" />
          </A>
        </Wrapper>
      </Flex>
    </Popup>
  );
};
