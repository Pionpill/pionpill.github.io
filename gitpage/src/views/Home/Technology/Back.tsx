import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Trans, useTranslation } from "react-i18next";
import { FaJava } from "react-icons/fa";
import {
  SiApachemaven,
  SiMicrosoftsqlserver,
  SiMysql,
  SiSpring,
  SiSpringboot,
} from "react-icons/si";
import Wrapper from "../../../components/Wrapper";
import { TechPath } from "../../../components/svg/Path";
import Svg from "../../../components/svg/Svg";
import Text from "../../../components/svg/Text";
import { TechTextRect } from "../../../components/svg/TextRect";
import useThemeChoice from "../../../hooks/useThemeChoice";
import techColor from "../../../styles/tech";
import { homeTheme } from "../../../styles/theme";

const Back: React.FC = () => {
  const noteColor = useThemeChoice(grey[800], grey[100]);
  const { t } = useTranslation();

  return (
    <Wrapper
      bgcolor={useThemeChoice(homeTheme[50], grey[900])}
      sx={{ flexDirection: "column" }}
    >
      <Typography
        variant="h5"
        fontWeight="fontWeightBold"
        alignSelf="left"
        width="100%"
      >
        <Trans i18nKey="home-technology.backStack" />
      </Typography>
      <Svg width="650" height="500" style={{ maxWidth: "100%" }}>
        <TechPath d="M 400 40 L 400 175" />
        <Text x="400" y="20" size={2} fill={noteColor}>
          {t("home-technology.basic")}
        </Text>
        <TechPath dash d="M 350 110 L 250 80" />
        <TechPath dash d="M 350 110 L 250 110" />
        <TechPath dash d="M 350 110 L 250 140" />
        <TechPath dash d="M 450 110 L 550 110" />
        <TechPath dash d="M 450 110 L 550 140" />
        <TechTextRect
          x="400"
          y="110"
          text="Java"
          icon={<FaJava color="white" />}
        />
        <TechTextRect x="200" y="80" text="utils" component />
        <TechTextRect x="200" y="110" text="juc" component />
        <TechTextRect x="200" y="140" component text="jvm" />
        <TechTextRect x="575" y="110" width="70" text="lombok" component />
        <TechTextRect x="575" y="140" width="70" text="validation" component />
        <TechTextRect
          x="400"
          y="150"
          component
          width="70"
          fill={techColor.xxx}
          text="maven"
          indent="-5"
          icon={<SiApachemaven color="white" />}
        />
        <TechPath d="M 400 175 Q 400 200 300 200 Q 250 200 250 225" />
        <TechPath d="M 400 175 Q 400 200 500 200 Q 550 200 550 225" />
        <Text x="250" y="240" size={2} fill={noteColor}>
          {t("home-technology.framework")}
        </Text>
        <Text x="550" y="240" size={2} fill={noteColor}>
          {t("home-technology.database")}
        </Text>
        <TechPath d="M 250 260 L 250 480" />
        <TechPath d="M 550 260 L 550 350" />
        <TechTextRect
          x="250"
          y="300"
          text="Spring"
          icon={<SiSpring color="white" />}
        />
        <TechTextRect x="250" y="340" indent="20" text="SpringMVC" />
        <TechPath dash d="M 200 380 L 130 380" />
        <TechPath dash d="M 200 380 L 130 410" />
        <TechPath dash d="M 320 380 L 380 350" />
        <TechPath dash d="M 320 380 L 380 380" />
        <TechPath dash d="M 320 380 L 380 410" />
        <TechPath dash d="M 550 350 L 430 380" />
        <TechPath dash d="M 550 350 L 430 410" />
        <TechTextRect
          x="250"
          y="380"
          indent="20"
          text="SpringBoot"
          icon={<SiSpringboot color="white" />}
        />
        <TechTextRect
          x="70"
          y="380"
          indent="-5"
          text="SpringSecurity"
          fill={techColor.xxx}
          component
        />
        <TechTextRect
          x="70"
          y="410"
          indent="-5"
          text="RocketMq"
          fill={techColor.xxxxxx}
          component
        />
        <TechTextRect
          x="400"
          width="100"
          y="350"
          indent="-5"
          text="MyBatis"
          fill={techColor.xxx}
          component
        />
        <TechTextRect
          x="400"
          width="100"
          y="380"
          indent="-5"
          text="Spring Data Jpa"
          fill={techColor.xxx}
          component
        />
        <TechTextRect
          x="400"
          width="100"
          y="410"
          indent="-5"
          text="Redis"
          fill={techColor.xx}
          component
        />
        <TechTextRect
          x="250"
          y="480"
          indent="20"
          fill={techColor.xxxxxx}
          text="SpringCloud"
        />
        <TechTextRect
          x="550"
          y="340"
          text="MySQL"
          icon={<SiMysql color="white" />}
        />
        <TechTextRect
          x="550"
          y="300"
          text="SqlServer"
          fill={techColor.x}
          indent="20"
          icon={<SiMicrosoftsqlserver color="white" />}
        />
      </Svg>
    </Wrapper>
  );
};

export default Back;
