import { Avatar, Grid, Paper, Typography } from "@mui/material";
import {
  blue,
  blueGrey,
  deepOrange,
  grey,
  red,
  teal,
  yellow,
} from "@mui/material/colors";
import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { BsFillClipboard2DataFill } from "react-icons/bs";
import { FaJava, FaReact } from "react-icons/fa";
import { RiDeviceFill } from "react-icons/ri";
import {
  SiAdobeillustrator,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBlender,
  SiD3Dotjs,
  SiIntellijidea,
  SiJavascript,
  SiLatex,
  SiMui,
  SiMysql,
  SiPlotly,
  SiPython,
  SiRedux,
  SiSpring,
  SiSpringboot,
  SiSpringsecurity,
  SiTableau,
  SiTypescript,
  SiUbuntu,
  SiVisualstudiocode,
} from "react-icons/si";
import { TbBrandThreejs } from "react-icons/tb";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { icon56x } from "../../../styles/macro";
import { homeTheme } from "../../../styles/theme";

type DevelopPaperProps = {
  theme: any;
  titleIcon: any;
  titleI18nKey: string;
  contentI18nKey: string;
  icons: ReactNode;
};

const DevelopPaper: React.FC<DevelopPaperProps> = ({
  theme,
  titleIcon,
  titleI18nKey,
  contentI18nKey,
  icons,
}) => {
  return (
    <Grid item md={6} sm={12} width="100%" height="100%">
      <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
        <FlexBox gap={2} sx={{ flexDirection: "column" }}>
          <FlexBox gap={2} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{
                borderRadius: "4px",
                bgcolor: useThemeChoice(theme[100], theme[300]),
                ...icon56x,
              }}
            >
              {titleIcon}
            </Avatar>
            <FlexBox sx={{ flexDirection: "column" }} gap={1}>
              <Typography variant="h5" fontWeight="fontWeightBold">
                <Trans i18nKey={titleI18nKey} />
              </Typography>
              <FlexBox sx={{ color: theme[400] }} gap={1}>
                {icons}
              </FlexBox>
            </FlexBox>
          </FlexBox>
          <Typography color="text.secondary">
            <Trans i18nKey={contentI18nKey} />
          </Typography>
        </FlexBox>
      </Paper>
    </Grid>
  );
};

type AppCardProps = {
  degree: number;
  title: string;
  labelI18nKey: string;
  icon?: ReactNode;
};

const AppCard: React.FC<AppCardProps> = ({
  degree,
  labelI18nKey,
  title,
  icon,
}) => {
  const lineColor =
    degree >= 80
      ? red[800]
      : degree >= 60
      ? blueGrey[800]
      : degree >= 40
      ? teal[800]
      : yellow[800];

  const bgColor = useThemeChoice("#cdcdcd", "#e1e2e6");
  return (
    <Grid item sm={12} md={6} lg={4}>
      <FlexBox
        sx={{
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: "350px",
        }}
        gap={1}
      >
        <FlexBox sx={{ alignItems: "flex-end" }} gap={1}>
          {icon && <FlexBox style={{ padding: "6px 0" }}>{icon}</FlexBox>}
          <Typography variant="h6" fontWeight="fontWeightBold">
            {title}
          </Typography>
          <Typography color="text.secondary" variant="subtitle2">
            <Trans i18nKey={labelI18nKey} />
          </Typography>
        </FlexBox>
        <FlexBox
          bgcolor={bgColor}
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            minHeight: "3px",
            position: "relative",
          }}
        >
          <FlexBox
            bgcolor={lineColor}
            sx={{
              width: `${degree}%`,
              minHeight: "3px",
              position: "relative",
            }}
          />
        </FlexBox>
      </FlexBox>
    </Grid>
  );
};

const Develop: React.FC = () => {
  return (
    <Wrapper
      bgcolor={useThemeChoice(homeTheme[50], grey[900])}
      sx={{ flexDirection: "column" }}
    >
      <FlexBox sx={{ flexDirection: "column", width: "100%" }} gap={2}>
        <FlexBox sx={{ flexDirection: "column", alignSelf: "flex-start" }}>
          <Typography variant="h5" fontWeight="fontWeightBold">
            <Trans i18nKey="home-profile.direction" />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <Trans i18nKey="home-profile.directionAbstract" />
          </Typography>
        </FlexBox>
        <Grid container spacing={2}>
          <DevelopPaper
            theme={red}
            titleIcon={<FaJava color={red[900]} size={36} />}
            titleI18nKey="home-profile.javaDevelop"
            contentI18nKey="home-profile.javaContent"
            icons={
              <>
                <SiSpring size={18} /> <SiSpringboot size={18} />
                <SiSpringsecurity size={18} />
              </>
            }
          />
          <DevelopPaper
            theme={blue}
            titleIcon={<SiJavascript color={blue[900]} size={36} />}
            titleI18nKey="home-profile.jsDevelop"
            contentI18nKey="home-profile.jsContent"
            icons={
              <>
                <SiTypescript size={18} /> <FaReact size={18} />
                <SiRedux size={18} /> <SiMui size={18} />{" "}
                <SiD3Dotjs size={18} />
              </>
            }
          />
          <DevelopPaper
            theme={deepOrange}
            titleIcon={
              <BsFillClipboard2DataFill color={deepOrange[900]} size={36} />
            }
            titleI18nKey="home-profile.visualDevelop"
            contentI18nKey="home-profile.visualContent"
            icons={
              <>
                <SiPlotly size={18} /> <SiD3Dotjs size={18} />
                <TbBrandThreejs size={18} /> <SiPlotly size={18} />
              </>
            }
          />
          <DevelopPaper
            theme={teal}
            titleIcon={<RiDeviceFill color={teal[900]} size={36} />}
            titleI18nKey="home-profile.other"
            contentI18nKey="home-profile.otherContent"
            icons={
              <>
                <SiPython size={18} /> <SiLatex size={18} />{" "}
                <SiMysql size={18} />
              </>
            }
          />
        </Grid>
      </FlexBox>
      <FlexBox sx={{ flexDirection: "column", width: "100%" }} gap={2}>
        <FlexBox sx={{ flexDirection: "column", alignSelf: "flex-start" }}>
          <Typography variant="h5" fontWeight="fontWeightBold">
            <Trans i18nKey="home-profile.software" />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <Trans i18nKey="home-profile.softwareAbstract" />
          </Typography>
        </FlexBox>
        <Grid container spacing={1}>
          <AppCard
            icon={<SiVisualstudiocode size={18} />}
            degree={90}
            title="VsCode"
            labelI18nKey="home-profile.vscodeLabel"
          />
          <AppCard
            icon={<SiIntellijidea size={18} />}
            degree={60}
            title="IDE"
            labelI18nKey="home-profile.javaLabel"
          />
          <AppCard
            icon={<SiUbuntu size={18} />}
            degree={40}
            title="Ubuntu"
            labelI18nKey="home-profile.ubuntuLabel"
          />
          <AppCard
            icon={<SiAdobephotoshop size={18} />}
            degree={40}
            title="Photoshop"
            labelI18nKey="home-profile.psLabel"
          />
          <AppCard
            icon={<SiAdobeillustrator size={18} />}
            degree={70}
            title="Illustrator"
            labelI18nKey="home-profile.aiLabel"
          />
          <AppCard
            icon={<SiAdobelightroom size={18} />}
            degree={70}
            title="LightRoom"
            labelI18nKey="home-profile.lrLabel"
          />
          <AppCard
            icon={<SiAdobepremierepro size={18} />}
            degree={50}
            title="PremierePro"
            labelI18nKey="home-profile.prLabel"
          />
          <AppCard
            icon={<SiBlender size={18} />}
            degree={30}
            title="Blender"
            labelI18nKey="home-profile.blenderLabel"
          />
          <AppCard
            icon={<SiTableau size={18} />}
            degree={40}
            title="Tableau"
            labelI18nKey="home-profile.tableauLabel"
          />
        </Grid>
      </FlexBox>
    </Wrapper>
  );
};

export default Develop;
