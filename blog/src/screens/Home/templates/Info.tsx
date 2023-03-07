import {
  faCamera,
  faHome,
  faLocationDot,
  faMountainSun,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBlender,
  SiIntellijidea,
  SiVisualstudiocode,
} from "react-icons/si";
import styled from "styled-components";
import Brand from "../../../components/Brand";
import Flex from "../../../components/Flex";
import H1 from "../../../components/H1";
import Icon from "../../../components/Icon";
import P from "../../../components/P";
import { terrain } from "../../../shared/img";
import { Github } from "../../../shared/info";
import { breakpoints } from "../../../styles/measure";

const InfoWrapper = styled(Flex)`
  flex-direction: column;
  background: linear-gradient(
      rgba(255, 255, 255, 0) 25%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.75) 100%
    ),
    url(${() => terrain["map-1"]}) no-repeat center;
  background-size: cover;
  padding: 125px 0 25px 0;
  gap: 12px;
  width: 100%;
  height: 500px;
  @media screen and (max-width: ${breakpoints.phone}) {
    height: calc(100vh- 50px);
  }
`;

const BaseInfo: React.FC = () => {
  return (
    <Flex column gap="xs">
      <Icon width="128px" src={Github.icon}></Icon>
      <Flex align="baseline">
        <H1 color="white">北岸 pionpill</H1>
      </Flex>
      <P color="white">
        <FontAwesomeIcon icon={faLocationDot} /> &nbsp; 江苏 南京 &nbsp;
        <FontAwesomeIcon icon={faHome} title="从小生长在无锡" /> &nbsp; 江苏
        无锡 &nbsp;
        <FontAwesomeIcon icon={faSchool} title="从小生长在无锡" /> &nbsp; 在校
      </P>
      <P color="white">专业: React 前端, Java 后端 | 兴趣: Minecraft 开发</P>
    </Flex>
  );
};

const BrandInfo: React.FC = () => {
  return (
    <Flex column>
      <Flex wrap>
        <Brand color="red">Java</Brand>
        <Brand color="red">SpringBoot</Brand>
        <Brand color="green">TypeScript</Brand>
        <Brand color="green">React</Brand>
        <Brand>Python</Brand>
        <Brand>LaTex</Brand>
        <Brand color="purple">Minecraft</Brand>
      </Flex>
      <Flex wrap>
        <SiAdobephotoshop
          color="#fff"
          title="Lightroom: Adobe 旗下专业图像处理与创作软件"
        />
        <SiAdobeillustrator
          color="#fff"
          title="Lightroom: Adobe 旗下矢量图绘制软件"
        />
        <SiAdobepremierepro
          color="#fff"
          title="Lightroom: Adobe 旗下影像处理(剪辑)软件"
        />
        <SiAdobelightroom
          color="#fff"
          title="Lightroom: Adobe 旗下专业raw格式图像处理软件"
        />
        <SiAdobeindesign
          color="#fff"
          title="InDesign: Adobe 旗下书籍/杂志设计与排版软件"
        />
        <SiBlender color="#fff" title="blender: 一款开源的三维建模与渲染软件" />
        <FontAwesomeIcon
          icon={faMountainSun}
          color="#fff"
          title="地形绘制 Gaea/WorldMachine"
        />
        <FontAwesomeIcon icon={faCamera} color="#fff" title="摄影" />
        <SiVisualstudiocode
          color="#fff"
          title="VSCode: 宇宙最好用的文本编辑器"
        ></SiVisualstudiocode>
        <SiIntellijidea color="#fff" title="IDEA: Java IDE"></SiIntellijidea>
      </Flex>
    </Flex>
  );
};

const Info: React.FC = () => {
  return (
    <InfoWrapper>
      <BaseInfo />
      <BrandInfo />
    </InfoWrapper>
  );
};

export default Info;
