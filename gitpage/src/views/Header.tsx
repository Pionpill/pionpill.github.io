import {
  AppBar,
  Avatar,
  IconButton,
  Typography
} from "@mui/material";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiTwotoneMail } from "react-icons/ai";
import {
  BsFillStarFill,
  BsGithub,
  BsMoonStarsFill,
  BsSunFill,
} from "react-icons/bs";
import { FaWeixin } from "react-icons/fa";
import { LuLanguages } from "react-icons/lu";
import { RiEnglishInput } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FlexBox from "../components/FlexBox";
import {
  useLargeMinMedia,
  useMiddleMinMedia,
  useSmallMinMedia,
} from "../hooks/useMedia";
import {
  github_avatar,
  github_link,
  gitpage_project_link,
  headerHeight,
} from "../shared/config";
import { RootState } from "../stores";
import { switchLang, switchTheme } from "../stores/appSlice";
import { toggleEmail, toggleWeixin } from "../stores/viewSlice";
import { icon36x } from "../styles/macro";
import DesktopRouteLinks from "./templates/DesktopRouteLinks";
import MobileRouteLinks from "./templates/MobileRouteLinks";

const Title: React.FC = () => {
  return (
    <FlexBox sx={{ alignItems: "center" }} gap={2}>
      {useLargeMinMedia() && (
        <Avatar alt="pionpill" src={github_avatar} sx={icon36x} />
      )}
      <Typography
        component={Link}
        to="/home/profile"
        variant="h6"
        sx={{
          fontWeight: "fontWeightBold",
          color: "text.primary",
          textDecoration: "none",
        }}
      >
        Pionpill / gitpage
      </Typography>
    </FlexBox>
  );
};

const Controls: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.app.theme);
  const lang = useSelector((state: RootState) => state.app.lang);
  return (
    <FlexBox sx={{ alignItems: "center" }} gap={2}>
      <FlexBox>
        <IconButton
          onClick={() => dispatch(switchTheme())}
          color="primary"
          title={t("root.changeTheme") as string}
        >
          {theme === "light" ? <BsSunFill size={16} /> : <BsMoonStarsFill size={16} /> }
        </IconButton>
        <IconButton
          onClick={() => {
            dispatch(switchLang()), location.reload();
          }}
          color="primary"
          title={t("root.changeLang") as string}
        >
          {lang === "en" ? (
            <RiEnglishInput size={16} />
          ) : (
            <LuLanguages size={16} />
          )}
        </IconButton>
        {useSmallMinMedia() && (
          <IconButton
            color="secondary"
            component="a"
            href={gitpage_project_link}
            title={t("root.starMe") as string}
          >
            <BsFillStarFill size={16} />
          </IconButton>
        )}
      </FlexBox>
      {useMiddleMinMedia() && (
        <FlexBox alignItems="center" gap={0.5}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="root.concat" />
          </Typography>
          <IconButton component="a" href={github_link} sx={{ p: 0.5 }}>
            <BsGithub size={16} />
          </IconButton>
          <IconButton
            component="a"
            onClick={() => dispatch(toggleWeixin())}
            sx={{ p: 0.5 }}
          >
            <FaWeixin size={16} />
          </IconButton>
          <IconButton
            component="a"
            onClick={() => dispatch(toggleEmail())}
            sx={{ p: 0.5 }}
          >
            <AiTwotoneMail size={16} />
          </IconButton>
        </FlexBox>
      )}
    </FlexBox>
  );
};

const Header: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      id="header"
      sx={{
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        bgcolor: "background.paper",
        height: headerHeight,
      }}
    >
      
        {!useMiddleMinMedia() && <MobileRouteLinks />}
        <Title />
        {useMiddleMinMedia() && <DesktopRouteLinks />}
        <Controls />
    </AppBar>
  );
};

export default Header;
