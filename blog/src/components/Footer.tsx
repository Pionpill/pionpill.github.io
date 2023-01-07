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
  width: auto;
  align-items: center;
  justify-content: center;
  padding: 0.5em 1em;
  flex-direction: column;
`;

const Link = styled(A)`
  color: ${(props) => props.theme.text_reverse_second};
  margin: 0.25em;
`;

export const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <Flex justify="center" gap="5px" column={true} align="center">
        <P weight="bold" type="reverse-second">
          博客使用的开源技术
        </P>
        <Flex wrap={true} gap="0px 25px">
          <Link href="https://react.docschina.org/">React</Link>
          <Link href="https://www.typescriptlang.org/">TypeScript</Link>
          <Link href="https://code.visualstudio.com/">VSCode</Link>
          <Link href="https://fontawesome.com/">fontawesome</Link>
          <Link href="https://react-icons.github.io/react-icons/">
            react-icons
          </Link>
          <Link href="https://www.npmjs.com/package/gh-pages">gh-pages</Link>
          <Link href="https://github.com/styled-components/polished">
            polished
          </Link>
          <Link href="https://www.npmjs.com/package/qrcode.react">
            qrcode.react
          </Link>
          <Link href="https://styled-components.com/">styled-components</Link>
          <Link href="https://github.com/remix-run/react-router">
            react-router
          </Link>
        </Flex>
      </Flex>
      <hr />
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
          项目地址(MIT):&nbsp;
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
