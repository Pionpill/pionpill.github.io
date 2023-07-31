import {
  AppBar,
  Avatar,
  Collapse,
  Container,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
  Popover,
  Typography,
} from "@mui/material";
import React, { PropsWithChildren, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiFillHome, AiFillProfile, AiTwotoneMail } from "react-icons/ai";
import {
  BsFillStarFill,
  BsGithub,
  BsMoonStarsFill,
  BsSunFill,
} from "react-icons/bs";
import { FaBars, FaBlog, FaProjectDiagram, FaWeixin } from "react-icons/fa";
import { GiRiver, GiSkills } from "react-icons/gi";
import { LuLanguages } from "react-icons/lu";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { RiArticleFill, RiEnglishInput } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, To } from "react-router-dom";
import FlexBox from "../components/FlexBox";
import RouteLink from "../components/RouteLink";
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
import { homeTheme } from "../styles/theme";

type ListItemProps = {
  icon: ReactNode;
  open: boolean;
  setOpen: Function;
  i18nKey: string;
};

const HeaderListItem: React.FC<ListItemProps> = ({
  icon,
  open,
  setOpen,
  i18nKey,
}) => {
  const { t } = useTranslation();

  return (
    <ListItemButton onClick={() => setOpen(!open)}>
      {icon && (
        <ListItemIcon sx={{ minWidth: "auto", pr: 2 }}>{icon}</ListItemIcon>
      )}
      <ListItemText
        primaryTypographyProps={{ fontWeight: "fontWeightBold" }}
        primary={t(i18nKey) as string}
      />
      {open ? <MdExpandLess /> : <MdExpandMore />}
    </ListItemButton>
  );
};

const Title: React.FC = () => {
  return (
    <FlexBox sx={{ alignItems: "center" }} gap={2}>
      {useLargeMinMedia() && (
        <Avatar alt="pionpill" src={github_avatar} sx={icon36x} />
      )}
      <Typography
        component={Link}
        to="/home"
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
    <FlexBox sx={{ alignItems: "center" }}>
      <IconButton
        onClick={() => dispatch(switchTheme())}
        color="primary"
        title={t("root.changeTheme") as string}
      >
        {theme === "light" ? (
          <BsSunFill size={16} />
        ) : (
          <BsMoonStarsFill size={16} />
        )}
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
      {useMiddleMinMedia() && (
        <>
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
        </>
      )}
    </FlexBox>
  );
};

type SecondaryListItemProps = {
  to: To;
  theme: typeof homeTheme;
  icon: ReactNode;
} & ListItemTextProps;

const SecondaryListItem: React.FC<SecondaryListItemProps> = ({
  to,
  theme,
  icon,
  children,
  ...props
}) => {
  return (
    <ListItemButton sx={{ pl: 4 }} component={Link} to={to}>
      {icon && (
        <ListItemIcon sx={{ minWidth: "auto", pr: 2 }}>
          <Avatar
            sx={{
              color: theme[500],
              backgroundColor: theme[100],
              ...icon36x,
            }}
          >
            {icon}
          </Avatar>
        </ListItemIcon>
      )}
      <ListItemText {...props} />
    </ListItemButton>
  );
};

const DesktopRouteLinks: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { t } = useTranslation();
  let isMouseIn: boolean = false;
  const handleMouseEnter = () => {
    setOpen(true);
    isMouseIn = true;
  };
  let timeoutId: number;
  const handleMouseOut = () => {
    isMouseIn = false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (!isMouseIn) setOpen(false);
    }, 500);
  };

  const NavPopover: React.FC<PropsWithChildren> = ({ children }) => {
    const anchorEl = document.querySelector("header");
    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        open={open}
        sx={{
          zIndex: "speedDial",
        }}
      >
        <FlexBox onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut}>
          {children}
        </FlexBox>
      </Popover>
    );
  };

  return (
    <>
      <FlexBox
        component="nav"
        sx={{ alignItems: "center", height: "50px" }}
        gap={2}
      >
        <RouteLink
          id="home"
          to="/home/profile"
          i18nKey="root.home"
          expand
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseOut}
        />
        <RouteLink id="blog" to="/blog" i18nKey="root.blogs" />
        <RouteLink id="project" to="/project" i18nKey="root.projects" />
        <RouteLink id="article" to="/article" i18nKey="root.articles" />
        {/* <RouteLink id="work" to="/work" i18nKey="root.works" /> */}
      </FlexBox>
      <NavPopover>
        <List component="div">
          <SecondaryListItem
            to="/home/profile"
            theme={homeTheme}
            icon={<AiFillProfile size={24} />}
            primary={t("home.profile") as string}
            secondary={t("home.profileAbstract")}
          />
          <SecondaryListItem
            to="/home/experience"
            theme={homeTheme}
            icon={<GiRiver size={24} />}
            primary={t("home.experience") as string}
            secondary={t("home.experienceAbstract")}
          />
          <SecondaryListItem
            to="/home/technology"
            theme={homeTheme}
            icon={<GiSkills size={24} />}
            primary={t("home.technology") as string}
            secondary={t("home.technologyAbstract")}
          />
        </List>
      </NavPopover>
    </>
  );
};

const MobileRouteLinks: React.FC = () => {
  const anchorEl = document.querySelector("header");
  const [open, setOpen] = React.useState<boolean>(false);
  const [homeOpen, setHomeOpen] = React.useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <FaBars />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <List sx={{ width: "calc(100vw - 32px)" }}>
          <HeaderListItem
            icon={<AiFillHome size={18} style={{ color: homeTheme[700] }} />}
            open={homeOpen}
            setOpen={setHomeOpen}
            i18nKey="root.home"
          />
          <Collapse in={homeOpen} timeout="auto" unmountOnExit>
            <List component="div">
              <SecondaryListItem
                to="/home/profile"
                theme={homeTheme}
                icon={<AiFillProfile size={24} />}
                primary={t("home.profile") as string}
                secondary={t("home.profileAbstract")}
              />
              <SecondaryListItem
                to="/home/experience"
                theme={homeTheme}
                icon={<GiRiver size={24} />}
                primary={t("home.experience") as string}
                secondary={t("home.experienceAbstract")}
              />
              <SecondaryListItem
                to="/home/technology"
                theme={homeTheme}
                icon={<GiSkills size={24} />}
                primary={t("home.technology") as string}
                secondary={t("home.technologyAbstract")}
              />
            </List>
          </Collapse>
          <ListItemButton component={Link} to="/blog">
            <ListItemIcon sx={{ minWidth: "auto", pr: 2 }}>
              <FaBlog size={18} style={{ color: homeTheme[700] }} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontWeight: "fontWeightBold" }}
              primary={t("root.blogs") as string}
            />
          </ListItemButton>
          <ListItemButton component={Link} to="/project">
            <ListItemIcon sx={{ minWidth: "auto", pr: 2 }}>
              <FaProjectDiagram size={18} style={{ color: homeTheme[700] }} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontWeight: "fontWeightBold" }}
              primary={t("root.projects") as string}
            />
          </ListItemButton>
          <ListItemButton component={Link} to="/article">
            <ListItemIcon sx={{ minWidth: "auto", pr: 2 }}>
              <RiArticleFill size={18} style={{ color: homeTheme[700] }} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontWeight: "fontWeightBold" }}
              primary={t("root.articles") as string}
            />
          </ListItemButton>
        </List>
      </Popover>
    </>
  );
};

const Header: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      id="header"
      sx={{
        bgcolor: "background.paper",
        alignItems: "center",
        justifyContent: "center",
        minHeight: headerHeight,
        maxHeight: headerHeight,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: "3",
        }}
      >
        {!useMiddleMinMedia() && <MobileRouteLinks />}
        <Title />
        {useMiddleMinMedia() && <DesktopRouteLinks />}
        <Controls />
      </Container>
    </AppBar>
  );
};

export default Header;
