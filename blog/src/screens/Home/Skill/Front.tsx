import {
  faCss3,
  faHtml5,
  faJs,
  faReact,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SiElectron, SiRedux, SiTypescript } from "react-icons/si";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import Svg from "../../../components/svg/Svg";
import Text from "../../../components/svg/Text";
import { useThemeChoice } from "../../../hooks/useThemeChoice";
import { common } from "../../../styles/themes";
import SkillPath from "./components/SkillPath";
import SkillRectText from "./components/SkillRectText";

const StackSvg: React.FC = () => {
  const noteColor = useThemeChoice("#222", "#eee");
  return (
    <Svg width="650" height="700" style={{ maxWidth: "100%" }}>
      <SkillPath d="M 400 40 L 400 315" />
      <Text x="400" y="20" size="lg" fill={noteColor}>
        前端基础
      </Text>
      <Text x="400" y="330" size="lg" fill={noteColor}>
        框架路线
      </Text>
      <SkillPath d="M 400 350 Q 400 375 300 375 Q 275 375 275 400" />
      <SkillPath d="M 400 350 Q 400 375 500 375 Q 600 375 600 400" />
      <SkillPath d="M 275 400 L 275 585" />
      <SkillPath d="M 275 615 Q 275 630 225 630 Q 175 630 175 650" />
      <SkillPath d="M 275 615 Q 275 630 325 630 Q 375 630 375 650" />
      <SkillPath d="M 400 70 L 200 70" dash />
      <SkillPath d="M 400 150 L 200 150" dash />
      <SkillPath d="M 175 555 L 100 535" dash />
      <SkillPath d="M 175 555 L 100 575" dash />
      <SkillPath d="M 275 557 L 225 557" dash />
      <Text x="200" y="555" size="lg" fill={noteColor}>
        3D
      </Text>
      <Text x="275" y="600" size="lg" fill={noteColor}>
        跨平台
      </Text>
      <SkillRectText
        x="400"
        y="70"
        text="HTML5"
        icon={<FontAwesomeIcon icon={faHtml5} color="white" />}
      />
      <SkillRectText x="200" y="70" text="SVG" component />
      <SkillRectText
        x="400"
        y="110"
        text="CSS3"
        icon={<FontAwesomeIcon icon={faCss3} color="white" />}
      />
      <SkillRectText
        x="400"
        y="150"
        indent="20"
        text="JavaScript"
        icon={<FontAwesomeIcon icon={faJs} color="white" />}
      />
      <SkillRectText x="200" y="150" component text="DOM & Web API" />
      <SkillRectText
        x="400"
        y="190"
        indent="20"
        text="TypeScript"
        fill={common.xxx}
        icon={<SiTypescript color="#fff" size={1024} />}
      />
      <SkillRectText
        x="400"
        y="250"
        text="Webpack"
        width="80"
        component
        fill={common.xx}
      />
      <SkillRectText
        x="400"
        y="280"
        text="Vite"
        width="80"
        component
        fill={common.xx}
      />
      <SkillPath d="M 600 420 L 600 460" dash />
      <SkillRectText
        x="600"
        y="420"
        width="100"
        text="Vue3"
        indent="0"
        fill={common.x}
        icon={<FontAwesomeIcon icon={faVuejs} color="white" />}
      />

      <SkillRectText
        x="600"
        y="470"
        width="90"
        text="element-ui"
        fill={common.x}
        component
      />
      <SkillPath d="M 200 420 L 100 370" dash />
      <SkillPath d="M 200 420 L 100 400" dash />
      <SkillPath d="M 200 420 L 100 430" dash />
      <SkillPath d="M 200 420 L 100 460" dash />
      <SkillPath d="M 350 420 L 450 400" dash />
      <SkillPath d="M 350 420 L 450 430" dash />
      <SkillPath d="M 350 420 L 450 460" dash />
      <SkillRectText
        x="275"
        y="420"
        indent="10"
        text="React (hooks)"
        fill={common.xxxx}
        icon={<FontAwesomeIcon color="white" icon={faReact} />}
      />
      <SkillRectText
        x="60"
        y="400"
        component
        text="styled-components"
        fill={common.xxxx}
      />
      <SkillRectText x="60" y="430" component text="antd" fill={common.xx} />
      <SkillRectText
        x="60"
        y="370"
        component
        text="react-router"
        fill={common.xxx}
      />
      <SkillRectText x="60" y="460" component text="axios" fill={common.xxx} />
      <SkillRectText
        x="450"
        y="400"
        width="70"
        component
        text="amap"
        fill={common.xx}
      />
      <SkillRectText
        x="450"
        y="430"
        width="70"
        component
        text="echarts"
        fill={common.xxx}
      />
      <SkillRectText
        x="450"
        y="460"
        width="70"
        component
        text="d3.js"
        fill={common.purple}
      />
      <SkillRectText
        x="275"
        y="500"
        text="Redux"
        fill={common.xxx}
        icon={<SiRedux color="white" size="1024" />}
      />
      <SkillRectText
        x="60"
        y="540"
        text="tree.js"
        component
        fill={common.purple}
      />
      <SkillRectText
        x="60"
        y="570"
        text="ar.js"
        component
        fill={common.purple}
      />
      <SkillRectText
        x="175"
        y="670"
        indent="10"
        icon={<FontAwesomeIcon color="white" icon={faReact} />}
        text="React Native"
        fill={common.purple}
      />
      <SkillRectText
        x="375"
        y="670"
        text="Electorn"
        indent="20"
        fill={common.purple}
        icon={<SiElectron color="white" size="1024" />}
      />
    </Svg>
  );
};

const Front: React.FC = () => {
  return (
    <Flex bgSecond fullWidth>
      <Flex bleed gap="xxs" limitWidth column fullWidth>
        <H2>前端技术路线</H2>
        <StackSvg />
      </Flex>
    </Flex>
  );
};

export default Front;
