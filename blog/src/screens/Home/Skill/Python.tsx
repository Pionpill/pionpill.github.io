import { faPython } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SiJupyter, SiNumpy, SiPandas } from "react-icons/si";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import Svg from "../../../components/svg/Svg";
import { common } from "../../../styles/themes";
import SkillPath from "./components/SkillPath";
import SkillRectText from "./components/SkillRectText";

const StackSvg: React.FC = () => {
  return (
    <Svg width="600" height="230" style={{ maxWidth: "100%" }}>
      <SkillPath d="M 300 40 L 300 200" />
      <SkillPath dash d="M 350 70 L 250 70" />
      <SkillRectText
        x="300"
        y="70"
        text="Python"
        icon={<FontAwesomeIcon icon={faPython} color="white" />}
      />
      <SkillPath dash d="M 350 110 L 200 110" />
      <SkillRectText x="200" y="110" text="matplotlib" component />
      <SkillRectText x="400" y="110" text="plotly" component />
      <SkillRectText
        x="300"
        y="150"
        text="Jupyter"
        indent="10"
        fill={common.xxx}
        component
        icon={<SiJupyter color="white" size="1024" />}
      />
      <SkillRectText
        x="300"
        y="180"
        text="Numpy"
        indent="10"
        fill={common.xxx}
        component
        icon={<SiNumpy color="white" size="1024" />}
      />
      <SkillRectText
        x="300"
        y="210"
        text="Pandas"
        indent="10"
        fill={common.xxx}
        component
        icon={<SiPandas color="white" size="1024" />}
      />
    </Svg>
  );
};

const Python: React.FC = () => {
  return (
    <Flex bgSecond fullWidth>
      <Flex bleed gap="xxs" limitWidth column fullWidth>
        <H2>Python 技术路线</H2>
        <StackSvg />
      </Flex>
    </Flex>
  );
};

export default Python;
