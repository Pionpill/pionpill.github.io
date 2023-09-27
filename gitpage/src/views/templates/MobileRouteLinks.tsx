import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AiFillHome } from "react-icons/ai";
import { FaBars, FaBlog, FaProjectDiagram } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import { Link, To } from "react-router-dom";
import { homeTheme } from "../../styles/theme";
import { BlogList, ProfileList } from "./common";

type ListItemProps = {
  icon: ReactNode;
  i18nKey: string;
  to?: To;
  open?: boolean;
  setOpen?: Function;
};

const MobileListItem: React.FC<ListItemProps> = (props) => {
  const { icon, i18nKey, to, open, setOpen } = props;
  const { t } = useTranslation();
  const handleClick =
    open !== undefined && setOpen ? () => setOpen(!open) : undefined;

  return (
    <ListItemButton component={to ? Link : "div"} to={to} onClick={handleClick}>
      <ListItemIcon sx={{ minWidth: "auto", pr: 2 }}>{icon}</ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ fontWeight: "fontWeightBold" }}
        primary={t(i18nKey) as string}
      />
      {open !== undefined && (open ? <MdExpandLess /> : <MdExpandMore />)}
    </ListItemButton>
  );
};

const MobileRouteLinks: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [homeOpen, setHomeOpen] = React.useState<boolean>(false);
  const [blogOpen, setBlogOpen] = React.useState<boolean>(false);

  const anchorEl = document.querySelector("header");

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
          <MobileListItem
            i18nKey="root.home"
            icon={<AiFillHome size={18} style={{ color: homeTheme[700] }} />}
            open={homeOpen}
            setOpen={setHomeOpen}
          />
          <Collapse in={homeOpen} timeout="auto" unmountOnExit>
            <ProfileList />
          </Collapse>
          <MobileListItem
            i18nKey="root.blogs"
            icon={<FaBlog size={18} style={{ color: homeTheme[700] }} />}
            open={blogOpen}
            setOpen={setBlogOpen}
          />
          <Collapse in={blogOpen} timeout="auto" unmountOnExit>
            <BlogList />
          </Collapse>
          <MobileListItem
            to="/project"
            i18nKey="root.projects"
            icon={
              <FaProjectDiagram size={18} style={{ color: homeTheme[700] }} />
            }
          />
          <MobileListItem
            to="/article"
            i18nKey="root.articles"
            icon={<RiArticleFill size={18} style={{ color: homeTheme[700] }} />}
          />
        </List>
      </Popover>
    </>
  );
};

export default MobileRouteLinks;
