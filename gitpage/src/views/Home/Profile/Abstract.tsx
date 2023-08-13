import { Avatar, Button, Link, Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaReact } from "react-icons/fa";
import { FcPortraitMode, FcReading, FcShop } from "react-icons/fc";
import { SiMojangstudios } from "react-icons/si";
import { useDispatch } from "react-redux";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import { useMiddleMaxMedia, useSmallMedia } from "../../../hooks/useMedia";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { profile_img, profile_link } from "../../../shared/config";
import { toggleEmail } from "../../../stores/viewSlice";
import { flexCenter, icon24x } from "../../../styles/macro";
import { homeTheme } from "../../../styles/theme";

type DevelopCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

const DevelopPaper: React.FC<DevelopCardProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 1 }}>
      <FlexBox sx={{ flexDirection: "column" }} gap={1}>
        <FlexBox gap={2} sx={flexCenter}>
          <Avatar sx={{ bgcolor: homeTheme[100], ...icon24x }}>{icon}</Avatar>
          <Typography
            variant="h6"
            sx={{ color: homeTheme[700], fontWeight: "fontWeightBold" }}
          >
            {title}
          </Typography>
        </FlexBox>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {subtitle}
        </Typography>
      </FlexBox>
    </Paper>
  );
};

const Abstract: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSmallMedia = useSmallMedia();
  const isMiddleMaxMedia = useMiddleMaxMedia();

  return (
    <Wrapper
      bgcolor={useThemeChoice(homeTheme[50], grey[900])}
      sx={{ justifyContent: "space-between" }}
    >
      <FlexBox
        sx={{
          flexDirection: "column",
          maxWidth: useMiddleMaxMedia() ? "125px" : "200px",
        }}
        gap={2}
      >
        <DevelopPaper
          icon={<FcReading size={16} />}
          title={t("home-profile.learn")}
          subtitle={t("home-profile.learnAbstract")}
        />
        <DevelopPaper
          icon={<FcPortraitMode size={16} />}
          title={t("home-profile.work")}
          subtitle={t("home-profile.workAbstract")}
        />
        <DevelopPaper
          icon={<FcShop size={16} />}
          title={t("home-profile.life")}
          subtitle={t("home-profile.lifeAbstract")}
        />
      </FlexBox>
      <Paper
        elevation={0}
        sx={{
          height: "330px",
          width: isSmallMedia ? "205px" : "220px",
          background: `url(${profile_img}) no-repeat center`,
          backgroundSize: "cover",
        }}
      />
      <FlexBox
        sx={{
          height: "100%",
          justifyContent: "center",
          flexDirection: "column",
          color: "text.primary",
          width: isSmallMedia
            ? "100%"
            : isMiddleMaxMedia
            ? "300px"
            : "400px",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
          <Trans i18nKey="home-profile.personalProfile" />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Trans i18nKey="home-profile.abstract" />
        </Typography>
        <FlexBox>
          <Button
            sx={{ alignItems: "center", gap: 1, pl: 0 }}
            onClick={() => dispatch(toggleEmail())}
          >
            <Avatar
              sx={{
                borderRadius: "4px",
                backgroundColor: useThemeChoice(grey[100], grey[900]),
              }}
            >
              <FaReact color={homeTheme[900]} />
            </Avatar>
            <Typography
              variant="subtitle2"
              align="left"
              textTransform="lowercase"
              sx={{ maxWidth: "100px" }}
            >
              <Trans i18nKey="home-profile.contactWithFront" />
            </Typography>
          </Button>
          <Button
            sx={{ alignItems: "center", gap: 1 }}
            onClick={() => dispatch(toggleEmail())}
          >
            <Avatar
              sx={{
                borderRadius: "4px",
                backgroundColor: useThemeChoice(grey[100], grey[900]),
              }}
            >
              <SiMojangstudios color={homeTheme[900]} />
            </Avatar>
            <Typography
              variant="subtitle2"
              textTransform="lowercase"
              align="left"
              sx={{ maxWidth: "100px" }}
            >
              <Trans i18nKey="home-profile.contactWithMC" />
            </Typography>
          </Button>
        </FlexBox>
        <Link href={profile_link} underline="none">
          <Button
            variant="contained"
            sx={{ color: "white", bgcolor: homeTheme[900] }}
          >
            <Trans i18nKey="home-profile.pdfLink" />
          </Button>
        </Link>
      </FlexBox>
    </Wrapper>
  );
};

export default Abstract;
