import { faJava } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SiApachemaven,
  SiMicrosoftsqlserver,
  SiMysql,
  SiSpring,
  SiSpringboot,
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
    <Svg width="650" height="500" style={{ maxWidth: "100%" }}>
      <SkillPath d="M 400 40 L 400 175" />
      <Text x="400" y="20" size="lg" fill={noteColor}>
        后端基础
      </Text>
      <SkillPath dash d="M 350 110 L 250 80" />
      <SkillPath dash d="M 350 110 L 250 110" />
      <SkillPath dash d="M 350 110 L 250 140" />
      <SkillPath dash d="M 450 110 L 550 110" />
      <SkillPath dash d="M 450 110 L 550 140" />
      <SkillRectText
        x="400"
        y="110"
        text="Java"
        icon={<FontAwesomeIcon icon={faJava} color="white" />}
      />
      <SkillRectText x="200" y="80" text="utils" component />
      <SkillRectText x="200" y="110" text="juc" component />
      <SkillRectText x="200" y="140" component text="jvm" />
      <SkillRectText x="575" y="110" width="70" text="lombok" component />
      <SkillRectText x="575" y="140" width="70" text="validation" component />
      <SkillRectText
        x="400"
        y="150"
        component
        width="70"
        fill={common.xxx}
        text="maven"
        indent="-5"
        icon={<SiApachemaven size="1024" color="white" />}
      />
      <SkillPath d="M 400 175 Q 400 200 300 200 Q 250 200 250 225" />
      <SkillPath d="M 400 175 Q 400 200 500 200 Q 550 200 550 225" />
      <Text x="250" y="240" size="lg" fill={noteColor}>
        框架路线
      </Text>
      <Text x="550" y="240" size="lg" fill={noteColor}>
        数据库
      </Text>
      <SkillPath d="M 250 260 L 250 480" />
      <SkillPath d="M 550 260 L 550 350" />
      <SkillRectText
        x="250"
        y="300"
        text="Spring"
        icon={<SiSpring color="white" size="1024" />}
      />
      <SkillRectText x="250" y="340" indent="20" text="SpringMVC" />
      <SkillPath dash d="M 200 380 L 130 380" />
      <SkillPath dash d="M 200 380 L 130 410" />
      <SkillPath dash d="M 320 380 L 380 350" />
      <SkillPath dash d="M 320 380 L 380 380" />
      <SkillPath dash d="M 320 380 L 380 410" />
      <SkillPath dash d="M 550 350 L 430 380" />
      <SkillPath dash d="M 550 350 L 430 410" />
      <SkillRectText
        x="250"
        y="380"
        indent="20"
        text="SpringBoot"
        icon={<SiSpringboot color="white" size="1024" />}
      />
      <SkillRectText
        x="70"
        y="380"
        indent="-5"
        text="SpringSecurity"
        fill={common.xxx}
        component
      />
      <SkillRectText
        x="70"
        y="410"
        indent="-5"
        text="RocketMq"
        fill={common.purple}
        component
      />
      <SkillRectText
        x="400"
        width="100"
        y="350"
        indent="-5"
        text="MyBatis"
        fill={common.xxx}
        component
      />
      <SkillRectText
        x="400"
        width="100"
        y="380"
        indent="-5"
        text="Spring Data Jpa"
        fill={common.xxx}
        component
      />
      <SkillRectText
        x="400"
        width="100"
        y="410"
        indent="-5"
        text="Redis"
        fill={common.xx}
        component
      />
      <SkillRectText
        x="250"
        y="480"
        indent="20"
        fill={common.purple}
        text="SpringCloud"
      />
      <SkillRectText
        x="550"
        y="340"
        text="MySQL"
        icon={<SiMysql color="white" size="1024" />}
      />
      <SkillRectText
        x="550"
        y="300"
        text="SqlServer"
        fill={common.x}
        indent="20"
        icon={<SiMicrosoftsqlserver color="white" size="1024" />}
      />
    </Svg>
  );
};

const Front: React.FC = () => {
  return (
    <Flex bleed gap="xxs" limitWidth column fullWidth>
      <H2>后端技术路线</H2>
      <StackSvg />
    </Flex>
  );
};

export default Front;
