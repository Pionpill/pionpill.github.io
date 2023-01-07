import {
  faCamera,
  faHome,
  faHouseChimney,
  faLocationDot,
  faMountainSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBlender,
} from "react-icons/si";
import styled from "styled-components";
import { Brand } from "../../components/Brand";
import Flex from "../../components/Flex";
import { Icon } from "../../components/Icon";
import P from "../../components/P";
import { terrain } from "../../shared/img";
import { Github } from "../../shared/info";
import { spacing } from "../../styles/spacing";

const InfoWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
      rgba(255, 255, 255, 0) 25%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.75) 100%
    ),
    url(${() => terrain["map-1"]}) no-repeat center;
  background-size: cover;
  padding: ${() => spacing.padding};
  width: auto;
  gap: 4px;
`;

const BaseInfo: React.FC = () => {
  return (
    <>
      <Icon size="128px" border="circle" src={Github.icon}></Icon>
      <Flex align="baseline">
        <P type="reverse" size="2x" weight="bold" title="外婆家一条河谐音">
          北岸
        </P>
        <P type="reverse" size="2x" weight="bold" title="匹勾匹勾">
          pionpill
        </P>
      </Flex>
      <P type="reverse" wrap={true}>
        Coder, Designer, Artist; 主要开发方向: React 前端, Java 后端, Minecraft
        开发
      </P>
      <P type="reverse">
        <FontAwesomeIcon icon={faLocationDot} /> &nbsp; 江苏 南京 &nbsp;&nbsp;
        <FontAwesomeIcon icon={faHome} title="从小生长在无锡" /> &nbsp; 江苏
        无锡 &nbsp;&nbsp;
        <FontAwesomeIcon icon={faHouseChimney} title="老家" /> &nbsp; 湖北 天门
      </P>
    </>
  );
};

const BrandWrapper = styled(Flex)`
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 5px 10px;
  justify-content: center;
`;

const BrandInfo: React.FC = () => {
  return (
    <BrandWrapper>
      <FontAwesomeIcon icon={faCamera} color="#fff" title="摄影" />
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
      <Brand type="reverse" size="xsmall" color="red">
        Java
      </Brand>
      <Brand type="reverse" size="xsmall" color="red">
        SpringBoot
      </Brand>
      <Brand type="reverse" size="xsmall" color="green">
        TypeScript
      </Brand>
      <Brand type="reverse" size="xsmall" color="green">
        React
      </Brand>
      <Brand type="reverse" size="xsmall">
        Python
      </Brand>
      <Brand type="reverse" size="xsmall">
        LaTex
      </Brand>
      <Brand type="reverse" size="xsmall" color="purple">
        Minecraft
      </Brand>
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
    </BrandWrapper>
  );
};

export const Info: React.FC = () => {
  return (
    <InfoWrapper>
      <BaseInfo />
      <BrandInfo />
    </InfoWrapper>
  );
};
