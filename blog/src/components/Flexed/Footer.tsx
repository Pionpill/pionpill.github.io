import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { darken } from "polished";
import styled from "styled-components";
import { Github } from "../../shared/info";
import A from "../A";
import Flex from "../Flex";
import Icon from "../Icon";
import P from "../P";
import RouteLink from "../RouteLink";

const FooterWrapper = styled.footer<{ bottom?: boolean }>`
  background-color: ${({ theme }) => darken(0.1, theme.background)};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0.5em 0em;
  left: 0px;
  flex-wrap: wrap;
`;

export const Footer: React.FC = () => {
  return (
    <FooterWrapper id="footer">
      <Flex wrap align="flex-start" phoneResponsive style={{ gap: "36px" }}>
        <Flex gap="xxs" column align="flex-start">
          <Flex gap="xs">
            <Icon radius="circle" width="18px" src={Github.icon} />
            <RouteLink weight="xl" to="/">
              Pionpill/gitpage
            </RouteLink>
          </Flex>
          <P shallow="md" size="sm">
            个人博客，仅供学习与资料展示.
          </P>
          <Flex justify="flex-start" gap="lg">
            <A shallow="sm" href="https://github.com/Pionpill">
              <FontAwesomeIcon icon={faGithub} />
            </A>
            <A shallow="sm" href="https://twitter.com/pionpill">
              <FontAwesomeIcon icon={faTwitter} />
            </A>
            <A shallow="sm" href="mailto:673486387@qq.com">
              <FontAwesomeIcon icon={faEnvelope} />
            </A>
          </Flex>
        </Flex>
        <Flex gap="xxs" column align="flex-start" style={{ minWidth: "100px" }}>
          <P weight="xl">使用的开源技术</P>
          <A shallow="sm" href="https://react.docschina.org/">
            React
          </A>
          <A shallow="sm" href="https://cn.redux.js.org/">
            Redux
          </A>
          <A shallow="sm" href="https://www.typescriptlang.org/">
            TypeScript
          </A>
          <A shallow="sm" href="https://code.visualstudio.com/">
            VSCode
          </A>
          <A shallow="sm" href="https://www.microsoft.com/edge">
            Edge
          </A>
        </Flex>
        <Flex gap="xxs" column align="flex-start" style={{ minWidth: "100px" }}>
          <P weight="xl">使用的开源组件</P>
          <A shallow="sm" href="https://github.com/remix-run/react-router">
            react-router
          </A>
          <A shallow="sm" href="https://fontawesome.com/">
            fontawesome
          </A>
          <A shallow="sm" href="https://react-icons.github.io/react-icons/">
            react-icons
          </A>
          <A shallow="sm" href="https://www.npmjs.com/package/gh-pages">
            gh-pages
          </A>
          <A shallow="sm" href="https://github.com/styled-components/polished">
            polished
          </A>
          <A shallow="sm" href="https://www.npmjs.com/package/qrcode.react">
            qrcode.react
          </A>
          <A shallow="sm" href="https://styled-components.com/">
            styled-components
          </A>

          <A shallow="sm" href="https://echarts.apache.org/zh/index.html">
            echarts
          </A>
          <A shallow="sm" href="https://plotly.com/javascript/">
            plotly.js
          </A>
          <A shallow="sm" href="https://lbs.amap.com/">
            amap
          </A>
        </Flex>
        <Flex gap="xxs" column align="flex-start" style={{ minWidth: "100px" }}>
          <P weight="xl">数据来源</P>
          <A shallow="sm" href="https://github.com/">
            Github
          </A>
          <A shallow="sm" href="https://wakatime.com/@pionpill">
            WakaTime
          </A>
          <A shallow="sm" href="https://cloud.tencent.com/">
            Tecent COS
          </A>
        </Flex>
      </Flex>
    </FooterWrapper>
  );
};
