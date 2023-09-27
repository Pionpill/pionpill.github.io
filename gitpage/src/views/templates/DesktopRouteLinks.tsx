import { Popover } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { To } from "react-router";
import FlexBox from "../../components/FlexBox";
import RouteLink from "../../components/RouteLink";
import { BlogList, ProfileList } from "./common";

type HeaderPopoverButtonProps = PropsWithChildren & {
  id: string;
  to: To;
  i18nKey: string;
};

const HeaderPopoverButton: React.FC<HeaderPopoverButtonProps> = ({
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const anchorEl = document.querySelector("header");
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
    }, 300);
  };

  return (
    <>
      <RouteLink
        expand
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseOut}
        sx={{fontWeight: '500'}}
        {...props}
      />
      <Popover
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        sx={{
          zIndex: "speedDial",
        }}
      >
        <FlexBox onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut}>
          {children}
        </FlexBox>
      </Popover>
    </>
  );
};

const DesktopRouteLinks: React.FC = () => (
  <FlexBox sx={{ alignItems: "center", height: "50px" }} gap={3}>
    <HeaderPopoverButton id="home" to="/home/profile" i18nKey="root.home">
      <ProfileList />
    </HeaderPopoverButton>
    <HeaderPopoverButton id="blog" to="/blog" i18nKey="root.blogs">
      <BlogList />
    </HeaderPopoverButton>
    <RouteLink
      sx={{ fontWeight: "500" }}
      id="project"
      to="/project"
      i18nKey="root.projects"
    />
    <RouteLink
      sx={{ fontWeight: "500" }}
      id="article"
      to="/article"
      i18nKey="root.articles"
    />
    {/* <RouteLink id="work" to="/work" i18nKey="root.works" /> */}
  </FlexBox>
);

export default DesktopRouteLinks;
