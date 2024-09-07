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
import { BiCube } from "react-icons/bi";
import { BsFillClipboard2DataFill } from "react-icons/bs";
import { FaJava, FaReact } from "react-icons/fa";
import { RiDeviceFill } from "react-icons/ri";
import {
  SiAdobeillustrator,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiD3Dotjs,
  SiJavascript,
  SiLatex,
  SiMui,
  SiPlotly,
  SiPython,
  SiRedux,
  SiSpring,
  SiSpringboot,
  SiTypescript,
  SiVisualstudiocode
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
  const developConfig = [
    {
      theme: blue,
      Icon: SiJavascript,
      titleI18nKey: "home-profile.jsDevelop",
      contentI18nKey: "home-profile.jsContent",
      Icons: (
        <>
          <SiTypescript size={18} /> <FaReact size={18} />
          <SiRedux size={18} /> <SiMui size={18} />
        </>
      ),
    },
    {
      theme: red,
      Icon: FaJava,
      titleI18nKey: "home-profile.javaDevelop",
      contentI18nKey: "home-profile.javaContent",
      Icons: (
        <>
          <SiSpring size={18} /> <SiSpringboot size={18} />
        </>
      ),
    },
    {
      theme: deepOrange,
      Icon: BsFillClipboard2DataFill,
      titleI18nKey: "home-profile.visualDevelop",
      contentI18nKey: "home-profile.visualContent",
      Icons: (
        <>
          <SiPlotly size={18} /> <SiD3Dotjs size={18} />
          <TbBrandThreejs size={18} />
        </>
      ),
    },
    {
      theme: teal,
      Icon: RiDeviceFill,
      titleI18nKey: "home-profile.other",
      contentI18nKey: "home-profile.otherContent",
      Icons: (
        <>
          <SiPython size={18} /> <SiLatex size={18} />
        </>
      ),
    },
  ];

  const softwareConfig = [
    {
      Icon: SiVisualstudiocode,
      title: "VsCode",
      degree: 90,
      labelI18nKey: "home-profile.vscodeLabel",
    },
    {
      Icon: SiAdobephotoshop,
      title: "PhotoShop",
      degree: 40,
      labelI18nKey: "home-profile.psLabel",
    },
    {
      Icon: SiAdobeillustrator,
      title: "Illustrator",
      degree: 60,
      labelI18nKey: "home-profile.aiLabel",
    },
    {
      Icon: SiAdobelightroom,
      title: "LightRoom",
      degree: 70,
      labelI18nKey: "home-profile.lrLabel",
    },
    {
      Icon: SiAdobepremierepro,
      title: "PremierePro",
      degree: 50,
      labelI18nKey: "home-profile.blenderLabel",
    },
    {
      Icon: BiCube,
      title: "BlockBench",
      degree: 80,
      labelI18nKey: "home-profile.blockbenchLabel",
    },
  ];

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
          {developConfig.map(
            ({ theme, Icon, titleI18nKey, contentI18nKey, Icons }) => (
              <DevelopPaper
                theme={theme}
                titleIcon={<Icon color={red[900]} size={36} />}
                titleI18nKey={titleI18nKey}
                contentI18nKey={contentI18nKey}
                icons={Icons}
              />
            )
          )}
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
        <Grid container columnSpacing={8} rowSpacing={4}>
          {softwareConfig.map(({ Icon, degree, title, labelI18nKey }) => (
            <AppCard
              icon={<Icon size={18} />}
              degree={degree}
              title={title}
              labelI18nKey={labelI18nKey}
            />
          ))}
        </Grid>
      </FlexBox>
    </Wrapper>
  );
};

export default Develop;
