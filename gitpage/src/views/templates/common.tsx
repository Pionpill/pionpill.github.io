import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
} from "@mui/material";
import { MouseEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AiFillProfile } from "react-icons/ai";
import { FaPython } from "react-icons/fa";
import { GiRiver, GiSkills } from "react-icons/gi";
import { RiJavascriptFill } from "react-icons/ri";
import { SiMojangstudios } from "react-icons/si";
import { useDispatch } from "react-redux";
import { To } from "react-router";
import { Link } from "react-router-dom";
import { changeBlogCategory } from "../../stores/blogSlice";
import { icon36x } from "../../styles/macro";
import { blogTheme, homeTheme } from "../../styles/theme";

type SecondaryListItemProps = {
  to: To;
  theme: typeof blogTheme | typeof homeTheme;
  icon: ReactNode;
  handleClick?: MouseEventHandler;
} & ListItemTextProps;

export const SecondaryListItem: React.FC<SecondaryListItemProps> = (props) => {
  const { to, theme, icon, children, handleClick, ...textProps } = props;
  return (
    <ListItemButton
      sx={{ pl: 4, justifyContent: "flex-start" }}
      onClick={handleClick}
      component={Link}
      to={to}
    >
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
      <ListItemText {...textProps} />
    </ListItemButton>
  );
};

export const ProfileList: React.FC = () => {
  const { t } = useTranslation();
  const secondaryItems = [
    {
      segment: "profile",
      icon: <AiFillProfile size={24} />,
    },
    {
      segment: "experience",
      icon: <GiRiver size={24} />,
    },
    {
      segment: "technology",
      icon: <GiSkills size={24} />,
    },
  ];

  return (
    <List component="div">
      {secondaryItems.map((item) => (
        <SecondaryListItem
          key={item.segment}
          to={`/home/${item.segment}`}
          theme={homeTheme}
          icon={item.icon}
          primary={t(`home.${item.segment}`) as string}
          secondary={t(`home.${item.segment}Abstract`)}
        />
      ))}
    </List>
  );
};

export const BlogList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const secondaryItems = [
    {
      segment: "front",
      icon: <RiJavascriptFill size={24} />,
    },
    {
      segment: "minecraft",
      icon: <SiMojangstudios size={24} />,
    },
    {
      segment: "python",
      icon: <FaPython size={24} />,
    },
  ];

  return (
    <List component="div">
      {secondaryItems.map((item) => (
        <SecondaryListItem
          key={item.segment}
          to={`/blog`}
          theme={blogTheme}
          icon={item.icon}
          primary={t(`blog.${item.segment}`) as string}
          secondary={t(`blog.${item.segment}Abstract`)}
          handleClick={(e) => dispatch(changeBlogCategory(item.segment))}
        />
      ))}
    </List>
  );
};
