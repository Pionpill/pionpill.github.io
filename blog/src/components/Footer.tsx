import {
  faGithub,
  faQq,
  faTwitter,
  faWeixin,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { A } from "./A";
import Flex from "./Flex";
import P from "./P";

const FooterWrapper = styled.footer`
  background-color: ${(props) => props.theme.assist};
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0.5em 1em;
`;

export const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <Flex gap=".25em 1em" wrap={true} justify="center">
        <P type="reverse-second" size="small">
          <FontAwesomeIcon icon={faGithub} />
          &nbsp;
          <A href="https://github.com/Pionpill" type="reverse-second">
            @pionpill
          </A>
        </P>
        <P type="reverse-second" size="small">
          <FontAwesomeIcon icon={faTwitter} />
          &nbsp;
          <A type="reverse-second" href="https://twitter.com/pionpill">
            @pionpill
          </A>
        </P>
        <P type="reverse-second" size="small">
          <FontAwesomeIcon icon={faQq} />
          &nbsp;
          <A type="reverse-second" href="https://user.qzone.qq.com/673486387">
            小鸡炖蘑菇
          </A>
        </P>
        <P type="reverse-second" size="small">
          <FontAwesomeIcon icon={faWeixin} />
          &nbsp;
          <A type="reverse-second" href="https://user.qzone.qq.com/673486387">
            小葱拌豆腐
          </A>
        </P>

        <P type="reverse-second" size="small">
          <FontAwesomeIcon icon={faEnvelope} />
          &nbsp;
          <A type="reverse-second" href="mailto:673486387@qq.com">
            673486387@qq.com
          </A>
        </P>
        <P type="reverse-second" size="small">
          |
        </P>
        <P type="reverse-second" size="small">
          博客项目地址(MIT License):
          <A
            type="reverse-second"
            href="https://github.com/Pionpill/pionpill.github.io"
          >
            https://github.com/Pionpill/pionpill.github.io
          </A>
        </P>
        <P type="reverse-second" size="small">
          <FontAwesomeIcon icon={faCopyright} /> &nbsp; 2023
        </P>
      </Flex>
    </FooterWrapper>
  );
};
