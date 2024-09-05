import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Trans, useTranslation } from "react-i18next";
import { FaCss3, FaHtml5, FaJs, FaReact, FaVuejs } from "react-icons/fa";
import { SiElectron, SiTypescript } from "react-icons/si";
import Wrapper from "../../../components/Wrapper";
import { TechPath } from "../../../components/svg/Path";
import Svg from "../../../components/svg/Svg";
import Text from "../../../components/svg/Text";
import { TechTextRect } from "../../../components/svg/TextRect";
import useThemeChoice from "../../../hooks/useThemeChoice";
import techColor from "../../../styles/tech";

const Front: React.FC = () => {
  const noteColor = useThemeChoice(grey[800], grey[100]);
  const { t } = useTranslation();

  return (
    <Wrapper bgcolor="background.paper" sx={{ flexDirection: "column" }}>
      <Typography
        variant="h5"
        fontWeight="fontWeightBold"
        alignSelf="left"
        width="100%"
      >
        <Trans i18nKey="home-technology.frontStack" />
      </Typography>
      <Svg width="650" height="700" style={{ maxWidth: "100%" }}>
        <TechPath d="M 400 40 L 400 315" />
        <Text x="400" y="20" size={2} fill={noteColor}>
          {t("home-technology.basic")}
        </Text>
        <Text x="400" y="330" size={2} fill={noteColor}>
          {t("home-technology.framework")}
        </Text>
        <TechPath d="M 400 350 Q 400 375 300 375 Q 275 375 275 400" />
        <TechPath d="M 400 350 Q 400 375 500 375 Q 600 375 600 400" />
        <TechPath d="M 275 400 L 275 585" />
        <TechPath d="M 275 625 Q 275 640 225 640 Q 175 640 175 650" />
        <TechPath d="M 275 625 Q 275 640 325 640 Q 375 640 375 650" />
        <TechPath d="M 400 70 L 200 70" dash />
        <TechPath d="M 400 150 L 200 150" dash />
        <TechPath d="M 175 555 L 100 535" dash />
        <TechPath d="M 175 555 L 100 575" dash />
        <TechPath d="M 275 557 L 225 557" dash />
        <Text x="200" y="555" size={2} fill={noteColor}>
          3D
        </Text>
        <Text x="275" y="600" size={2} fill={noteColor}>
          {t("home-technology.platform")}
        </Text>
        <TechTextRect
          x="400"
          y="70"
          text="HTML5"
          icon={<FaHtml5 color="white" />}
        />
        <TechTextRect x="200" y="70" text="SVG" component />
        <TechTextRect
          x="400"
          y="110"
          text="CSS3"
          icon={<FaCss3 color="white" />}
        />
        <TechTextRect
          x="400"
          y="150"
          indent="20"
          text="JavaScript"
          icon={<FaJs color="white" />}
        />
        <TechTextRect x="200" y="150" component text="DOM & Web API" />
        <TechTextRect
          x="400"
          y="190"
          indent="20"
          text="TypeScript"
          fill={techColor.xxxx}
          icon={<SiTypescript color="white" />}
        />
        <TechTextRect
          x="400"
          y="250"
          text="Webpack"
          width="80"
          component
          fill={techColor.xx}
        />
        <TechTextRect
          x="400"
          y="280"
          text="Vite"
          width="80"
          component
          fill={techColor.xx}
        />
        <TechPath d="M 600 420 L 600 460" dash />
        <TechTextRect
          x="600"
          y="420"
          width="100"
          text="Vue3"
          indent="0"
          fill={techColor.xxx}
          icon={<FaVuejs color="white" />}
        />

        <TechTextRect
          x="600"
          y="470"
          width="90"
          text="element-ui"
          fill={techColor.xxx}
          component
        />
        <TechPath d="M 200 420 L 100 360" dash />
        <TechPath d="M 200 420 L 100 390" dash />
        <TechPath d="M 200 420 L 100 420" dash />
        <TechPath d="M 200 420 L 100 450" dash />
        <TechPath d="M 200 420 L 100 480" dash />
        <TechPath d="M 350 420 L 450 400" dash />
        <TechPath d="M 350 420 L 450 430" dash />
        <TechPath d="M 350 420 L 450 460" dash />
        <TechTextRect
          x="275"
          y="420"
          indent="10"
          text="React (hooks)"
          fill={techColor.xxxx}
          icon={<FaReact color="white" />}
        />
        <TechTextRect
          x="60"
          y="360"
          component
          text="react-router"
          fill={techColor.xxx}
        />
        <TechTextRect
          x="60"
          y="390"
          component
          text="styled-components"
          fill={techColor.xxxx}
        />
        <TechTextRect
          x="60"
          y="420"
          component
          text="antd"
          fill={techColor.xx}
        />
        <TechTextRect
          x="60"
          y="450"
          component
          text="material ui"
          fill={techColor.xxxx}
        />
        <TechTextRect
          x="60"
          y="480"
          component
          text="redux"
          fill={techColor.xxx}
        />
        <TechTextRect
          x="450"
          y="400"
          width="70"
          component
          text="amap"
          fill={techColor.xx}
        />
        <TechTextRect
          x="450"
          y="430"
          width="70"
          component
          text="echarts"
          fill={techColor.xxx}
        />
        <TechTextRect
          x="450"
          y="460"
          width="70"
          component
          text="d3.js"
          fill={techColor.xxxxxx}
        />
        <TechTextRect
          x="60"
          y="540"
          text="@react-three"
          component
          fill={techColor.xxx}
        />
        <TechTextRect
          x="60"
          y="570"
          text="ar.js"
          component
          fill={techColor.xxxxxx}
        />
        <TechTextRect
          x="175"
          y="670"
          indent="10"
          icon={<FaReact color="white" />}
          text="React Native"
          fill={techColor.xxxxxx}
        />
        <TechTextRect
          x="375"
          y="670"
          text="Electorn"
          indent="20"
          fill={techColor.xxxxxx}
          icon={<SiElectron color="white" />}
        />
      </Svg>
    </Wrapper>
  );
};

export default Front;
