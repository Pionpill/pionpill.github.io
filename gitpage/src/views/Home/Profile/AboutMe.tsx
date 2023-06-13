import { Grid, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Trans } from "react-i18next";
import {
  FcCollaboration,
  FcCommandLine,
  FcSportsMode,
  FcSteam,
  FcViewDetails,
} from "react-icons/fc";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import { homeTheme } from "../../../styles/theme";

type AboutMeItemProps = {
  icon: ReactNode;
  titleI18nKey: string;
  keywordsI18nKey: string;
  abstractI18nKey: string;
};

const AboutMeItem: React.FC<AboutMeItemProps> = ({
  icon,
  titleI18nKey,
  keywordsI18nKey,
  abstractI18nKey,
}) => {
  return (
    <Grid item sm={12} md={6} lg={4}>
      <FlexBox sx={{ flexDirection: "column" }} gap={1}>
        <FlexBox gap={1}>
          <FlexBox>{icon}</FlexBox>
          <Typography variant="h5" fontWeight="fontWeightBold">
            <Trans i18nKey={titleI18nKey} />
          </Typography>
        </FlexBox>
        <Typography color={homeTheme[900]}>
          <Trans i18nKey={keywordsI18nKey} />
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey={abstractI18nKey} />
        </Typography>
      </FlexBox>
    </Grid>
  );
};

const AboutMe: React.FC = () => {
  return (
    <Wrapper
      bgcolor="background.default"
      sx={{ justifyContent: "space-between" }}
    >
      <Typography
        sx={{ width: "100%", textAlign: "center" }}
        variant="h4"
        fontWeight="fontWeightBold"
      >
        <Trans i18nKey="home-profile.aboutMe" />
      </Typography>
      <Grid container spacing={3}>
        <AboutMeItem
          icon={<FcCollaboration size={32} />}
          titleI18nKey="home-profile.character"
          keywordsI18nKey="home-profile.characterKeywords"
          abstractI18nKey="home-profile.characterAbstract"
        />
        <AboutMeItem
          icon={<FcSportsMode size={32} />}
          titleI18nKey="home-profile.live"
          keywordsI18nKey="home-profile.liveKeywords"
          abstractI18nKey="home-profile.liveAbstract"
        />
        <AboutMeItem
          icon={<FcCommandLine size={32} />}
          titleI18nKey="home-profile.working"
          keywordsI18nKey="home-profile.workingKeywords"
          abstractI18nKey="home-profile.workingAbstract"
        />
        <AboutMeItem
          icon={<FcSteam size={32} />}
          titleI18nKey="home-profile.game"
          keywordsI18nKey="home-profile.gameKeywords"
          abstractI18nKey="home-profile.gameAbstract"
        />
        <AboutMeItem
          icon={<FcViewDetails size={32} />}
          titleI18nKey="home-profile.dream"
          keywordsI18nKey="home-profile.dreamKeywords"
          abstractI18nKey="home-profile.dreamAbstract"
        />
      </Grid>
    </Wrapper>
  );
};

export default AboutMe;
