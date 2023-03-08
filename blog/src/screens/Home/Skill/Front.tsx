import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import Svg from "../../../components/svg/Svg";
import Text from "../../../components/svg/Text";
import { useThemeChoice } from "../../../hooks/useThemeChoice";
import { common } from "../../../styles/themes";
import SkillRectText from "./components/SkillRectText";
import CSS3 from "./components/svg/CSS3";
import Electron from "./components/svg/Electron";
import Html5 from "./components/svg/Html5";
import JavaScript from "./components/svg/JavaScript";
import React from "./components/svg/React";
import Redux from "./components/svg/Redux";
import TypeScript from "./components/svg/TypeScript";
import Vue from "./components/svg/Vue";

const StackSvg: React.FC = () => {
  const noteColor = useThemeChoice("#222", "#eee");
  return (
    <Svg width="800" height="700" style={{ maxWidth: "100%" }}>
      <Text x="400" y="20" size="lg" fill={noteColor}>
        前端基础
      </Text>
      <Text x="450" y="340" size="lg" fill={noteColor}>
        框架路线
      </Text>
      <Text x="200" y="570" size="lg" fill={noteColor}>
        3D
      </Text>
      <Text x="400" y="620" size="lg" fill={noteColor}>
        跨平台
      </Text>
      <SkillRectText
        x="30"
        y="30"
        width="30"
        size="sm"
        text="弃用"
        radius="ellipse"
        fill={common.x}
      />
      <SkillRectText
        x="30"
        y="70"
        width="30"
        size="sm"
        text="了解"
        radius="ellipse"
        fill={common.xx}
      />
      <SkillRectText
        x="30"
        y="110"
        width="30"
        size="sm"
        text="熟悉"
        radius="ellipse"
        fill={common.xxx}
      />
      <SkillRectText
        x="30"
        y="150"
        width="30"
        size="sm"
        text="掌握"
        radius="ellipse"
        fill={common.xxxx}
      />
      <SkillRectText
        x="30"
        y="190"
        width="30"
        size="sm"
        text="精通"
        radius="ellipse"
        fill={common.xxxxx}
      />
      <SkillRectText
        x="30"
        y="230"
        width="30"
        size="sm"
        text="准备"
        radius="ellipse"
        fill={common.purple}
      />
      <SkillRectText x="400" y="70" text="HTML5" icon={<Html5 />} />
      <SkillRectText x="200" y="70" text="SVG" component />
      <SkillRectText x="400" y="110" text="CSS3" icon={<CSS3 />} />
      <SkillRectText
        x="400"
        y="150"
        indent="20"
        text="JavaScript"
        icon={<JavaScript />}
      />
      <SkillRectText x="200" y="150" component text="DOM & Web API" />
      <SkillRectText
        x="400"
        y="190"
        indent="20"
        text="TypeScript"
        fill={common.xxx}
        icon={<TypeScript />}
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
      <SkillRectText
        x="600"
        y="420"
        width="100"
        text="Vue3"
        indent="0"
        fill={common.x}
        icon={<Vue />}
      />
      <SkillRectText
        x="740"
        y="420"
        width="90"
        text="element-ui"
        fill={common.x}
        component
      />
      <SkillRectText
        x="275"
        y="420"
        indent="10"
        text="React (hooks)"
        fill={common.xxxx}
        icon={<React />}
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
        x="275"
        y="500"
        text="Redux"
        fill={common.xxx}
        icon={<Redux />}
      />
      <SkillRectText
        x="60"
        y="570"
        text="tree.js"
        component
        fill={common.purple}
      />
      <SkillRectText
        x="60"
        y="600"
        text="ar.js"
        component
        fill={common.purple}
      />
      <SkillRectText
        x="200"
        y="680"
        indent="10"
        icon={<React />}
        text="React Native"
        fill={common.purple}
      />
      <SkillRectText
        x="400"
        y="680"
        text="Electorn"
        indent="20"
        fill={common.purple}
        icon={<Electron />}
      />
    </Svg>
  );
};

const Front: React.FC = () => {
  return (
    <Flex bleed gap="xxs" limitWidth column fullWidth>
      <H2>前端技术栈</H2>
      <StackSvg />
    </Flex>
  );
};

export default Front;
