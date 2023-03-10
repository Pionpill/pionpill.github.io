import { faGit, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBlender,
  SiIntellijidea,
  SiLatex,
  SiLinux,
  SiTableau,
  SiVisualstudiocode,
} from "react-icons/si";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import Svg from "../../../components/svg/Svg";
import Text from "../../../components/svg/Text";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { common } from "../../../styles/themes";
import SkillPath from "./components/SkillPath";
import SkillRectText from "./components/SkillRectText";

const StackSvg: React.FC = () => {
  const noteColor = useThemeChoice("#222", "#eee");
  return (
    <Svg width="600" height="600" style={{ maxWidth: "100%" }}>
      <SkillRectText
        x="160"
        y="30"
        width="30"
        size="sm"
        text="弃用"
        radius="ellipse"
        fill={common.x}
      />
      <Text x="200" y="30" anchor="start" fill={noteColor}>
        曾今用过，现在不怎么用了。
      </Text>
      <SkillRectText
        x="160"
        y="70"
        width="30"
        size="sm"
        text="了解"
        radius="ellipse"
        fill={common.xx}
      />
      <Text x="200" y="70" anchor="start" fill={noteColor}>
        会用，可以查文档使用，不了解原理，没有系统学过。
      </Text>
      <SkillRectText
        x="160"
        y="110"
        width="30"
        size="sm"
        text="熟悉"
        radius="ellipse"
        fill={common.xxx}
      />
      <Text x="200" y="110" anchor="start" fill={noteColor}>
        系统地学过，经验不足，不了解原理。
      </Text>
      <SkillRectText
        x="160"
        y="150"
        width="30"
        size="sm"
        text="掌握"
        radius="ellipse"
        fill={common.xxxx}
      />
      <Text x="200" y="150" anchor="start" fill={noteColor}>
        系统学过，很熟练，了解大部分原理。
      </Text>
      <SkillRectText
        x="160"
        y="190"
        width="30"
        size="sm"
        text="精通"
        radius="ellipse"
        fill={common.xxxxx}
      />
      <Text x="200" y="190" anchor="start" fill={noteColor}>
        使用经验丰富，远离掌握透彻。
      </Text>
      <SkillRectText
        x="160"
        y="230"
        width="30"
        size="sm"
        text="准备"
        radius="ellipse"
        fill={common.purple}
      />
      <Text x="200" y="230" anchor="start" fill={noteColor}>
        准备学习，接下来的项目要使用。
      </Text>
      <SkillPath d="M 300 400 L 225 400" />
      <SkillPath d="M 300 400 L 377 400" />
      <SkillPath d="M 300 400 L 300 460" />
      <SkillRectText
        x="300"
        y="400"
        width="30"
        size="sm"
        text="Me"
        fill={common.xxxxx}
      />
      <Text x="200" y="400" size="lg" fill={noteColor}>
        编程
      </Text>
      <SkillPath dash d="M 175 400 L 100 320" />
      <SkillPath dash d="M 175 400 L 100 350" />
      <SkillPath dash d="M 175 400 L 100 380" />
      <SkillPath dash d="M 175 400 L 100 410" />
      <SkillPath dash d="M 175 400 L 100 440" />
      <SkillPath dash d="M 175 400 L 100 470" />
      <SkillPath dash d="M 175 400 L 100 500" />
      <SkillRectText
        x="50"
        y="320"
        width="100"
        indent="0"
        component
        text="NaviCat"
        fill={common.xxx}
      />
      <SkillRectText
        x="50"
        y="350"
        width="100"
        indent="0"
        component
        text="Github"
        fill={common.xxx}
        icon={<FontAwesomeIcon icon={faGithub} color="white" />}
      />
      <SkillRectText
        x="50"
        y="380"
        width="100"
        indent="0"
        component
        text="Git"
        fill={common.xxx}
        icon={<FontAwesomeIcon icon={faGit} color="white" />}
      />
      <SkillRectText
        x="50"
        y="410"
        width="100"
        indent="0"
        component
        text="VsCode"
        fill={common.xxxxx}
        icon={<SiVisualstudiocode color="white" size="1024" />}
      />
      <SkillRectText
        x="50"
        y="440"
        width="100"
        indent="0"
        component
        text="IDEA"
        fill={common.xxxx}
        icon={<SiIntellijidea color="white" size="1024" />}
      />
      <SkillRectText
        x="50"
        y="470"
        width="100"
        indent="0"
        component
        text="Linux"
        fill={common.xxx}
        icon={<SiLinux color="white" size="1024" />}
      />
      <SkillRectText
        x="50"
        y="500"
        width="100"
        indent="0"
        component
        text="Tableau"
        fill={common.xxx}
        icon={<SiTableau color="white" size="1024" />}
      />
      <Text x="400" y="400" size="lg" fill={noteColor}>
        图像
      </Text>
      <SkillPath dash d="M 425 400 L 480 320" />
      <SkillPath dash d="M 425 400 L 480 350" />
      <SkillPath dash d="M 425 400 L 480 380" />
      <SkillPath dash d="M 425 400 L 480 410" />
      <SkillPath dash d="M 425 400 L 480 440" />
      <SkillPath dash d="M 425 400 L 480 470" />
      <SkillRectText
        x="540"
        y="320"
        width="120"
        indent="0"
        component
        text="Photoshop"
        fill={common.xxx}
        icon={<SiAdobephotoshop color="white" size="1024" />}
      />
      <SkillRectText
        x="540"
        y="350"
        width="120"
        indent="0"
        component
        fill={common.xx}
        text="Blender"
        icon={<SiBlender color="white" size="1024" />}
      />
      <SkillRectText
        x="540"
        y="380"
        width="120"
        indent="0"
        component
        fill={common.x}
        text="InDesign"
        icon={<SiAdobeindesign color="white" size="1024" />}
      />
      <SkillRectText
        x="540"
        y="410"
        width="120"
        indent="0"
        component
        text="PremierePro"
        icon={<SiAdobepremierepro color="white" size="1024" />}
      />
      <SkillRectText
        x="540"
        y="440"
        width="120"
        indent="0"
        component
        text="lightRoom"
        icon={<SiAdobelightroom color="white" size="1024" />}
      />
      <SkillRectText
        x="540"
        y="470"
        width="120"
        indent="0"
        component
        text="Illustrator"
        fill={common.xxx}
        icon={<SiAdobeillustrator color="white" size="1024" />}
      />
      <Text x="300" y="475" size="lg" fill={noteColor}>
        文档
      </Text>
      <SkillPath dash d="M 300 500 L 300 580" />
      <SkillRectText
        x="300"
        y="550"
        width="90"
        indent="0"
        component
        text="Latex"
        icon={<SiLatex color="white" size="1024" />}
      />
      <SkillRectText
        x="300"
        y="580"
        width="90"
        indent="0"
        component
        text="Tikz"
        fill={common.xxx}
      />
    </Svg>
  );
};

const Basic: React.FC = () => {
  return (
    <Flex bleed gap="xxs" limitWidth column fullWidth>
      <H2>基础与软件</H2>
      <StackSvg />
    </Flex>
  );
};

export default Basic;
