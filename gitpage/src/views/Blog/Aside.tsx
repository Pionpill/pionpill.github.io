import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { Trans } from "react-i18next";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { FaBlog } from "react-icons/fa";
import { SiD3Dotjs } from "react-icons/si";
import FlexBox from "../../components/FlexBox";
import { blogTheme } from "../../styles/theme";

const Category: React.FC = () => {
  return (
    <FlexBox flexDirection="column" gap={1}>
      <FlexBox gap={1}>
        <FaBlog color={blogTheme[500]} size={24} />
        <Typography variant="h6">
          <Trans i18nKey="blog.category" />
        </Typography>
      </FlexBox>
      <Select value="front" size="small">
        <MenuItem value="front">
          <Trans i18nKey="blog.front" />
        </MenuItem>
        <MenuItem value="back">
          <Trans i18nKey="blog.back" />
        </MenuItem>
        <MenuItem value="cs">
          <Trans i18nKey="blog.cs" />
        </MenuItem>
        <MenuItem value="lang">
          <Trans i18nKey="blog.sql" />
        </MenuItem>
        <MenuItem value="other">
          <Trans i18nKey="blog.lang" />
        </MenuItem>
      </Select>
    </FlexBox>
  );
};

const BlogList: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <FlexBox flexDirection="column" gap={1}>
      <List component="aside">
        <ListItemButton
          sx={{ p: 0, pl: 1, gap: 1 }}
          onClick={() => setOpen(!open)}
        >
          {open ? <BiChevronDown /> : <BiChevronRight />}
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <SiD3Dotjs />
          </ListItemIcon>
          <ListItemText primary="D3.js" />
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{ ml: 2, pl: 1, borderLeft: "1px solid #ccc" }}
          >
            <ListItemButton sx={{ p: 0, pl: 1 }}>
              <ListItemText primary="123" />
            </ListItemButton>
            <ListItemButton sx={{ p: 0, pl: 1 }}>
              <ListItemText primary="123" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </FlexBox>
  );
};

const Aside: React.FC = () => {
  return (
    <FlexBox
      component="aside"
      width="325px"
      flexDirection="column"
      sx={{ borderRight: "1px solid #ccc", p: 2 }}
      gap={2}
    >
      <Category />
      <Divider />
      <BlogList />
    </FlexBox>
  );
};

export default Aside;
