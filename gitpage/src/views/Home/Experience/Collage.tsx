import { Avatar, Typography } from "@mui/material";
import { CSSProperties, PropsWithChildren } from "react";
import { Trans } from "react-i18next";
import {
  FaBook,
  FaCamera,
  FaDumbbell,
  FaJava,
  FaJs,
  FaNewspaper,
  FaPython,
  FaStar,
  FaSwimmer,
  FaTrophy,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { MdOutlineSportsTennis } from "react-icons/md";
import {
  SiAdobeillustrator,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiBlender,
  SiLatex,
  SiMojangstudios,
} from "react-icons/si";
import Absolute from "../../../components/Absolute";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import { useSmallMedia } from "../../../hooks/useMedia";
import useThemeChoice from "../../../hooks/useThemeChoice";

const AvatarIcon: React.FC<
  PropsWithChildren<{
    x?: CSSProperties["left"];
    y?: CSSProperties["bottom"];
  }>
> = ({ x, y, children }) => {
  const bgColor = useThemeChoice("#f1f2f6", "#2a2a2a");
  return (
    <Absolute x={x} y={y}>
      <Avatar sx={{ background: bgColor }}>{children}</Avatar>
    </Absolute>
  );
};

const IconGroup: React.FC<
  PropsWithChildren<{
    x?: CSSProperties["left"];
    y?: CSSProperties["bottom"];
  }>
> = ({ x, y, children }) => (
  <Absolute
    x={x}
    y={y}
    sx={{
      borderRadius: "100%",
      width: "60px",
      height: "60px",
      border: `1px dashed ${useThemeChoice("#2a2a2a", "#f1f2f6")}`,
    }}
  >
    <FlexBox sx={{ flexWrap: "wrap", p: 1, gap: 0.5 }}>{children}</FlexBox>
  </Absolute>
);

const CollageImg: React.FC = () => {
  const color = useThemeChoice("#bdc3c7", "#636e72");

  return (
    <FlexBox>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1942"
        width="300"
        height="300"
      >
        <path d="M150 75 L150 225" stroke={color}></path>
        <path d="M75 150 L226 150" stroke={color}></path>
      </svg>
      <AvatarIcon x="150px" y="150px">
        <GiGraduateCap color="#fc9588" size={36} />
      </AvatarIcon>
      <AvatarIcon x="150px" y="50px">
        <FaTrophy color="#94e6fe" size={24} />
      </AvatarIcon>
      <Absolute x="150px" y="20px">
        <Typography variant="caption" color="text.secondary">
          <Trans i18nKey="home-experience.mcm" />
        </Typography>
      </Absolute>
      <AvatarIcon x="50px" y="150px">
        <FaStar color="#db225d" size={24} />
      </AvatarIcon>
      <Absolute x="50px" y="180px">
        <Typography variant="caption" color="text.secondary">
          <Trans i18nKey="home-experience.communist" />
        </Typography>
      </Absolute>
      <AvatarIcon x="150px" y="250px">
        <FaNewspaper color="#2fb87e" size={24} />
      </AvatarIcon>
      <Absolute x="150px" y="280px">
        <Typography variant="caption" color="text.secondary" align="center">
          <Trans i18nKey="home-experience.news" />
        </Typography>
      </Absolute>
      <AvatarIcon x="250px" y="150px">
        <FaBook color="#5b4d96" size={24} />
      </AvatarIcon>
      <Absolute x="250px" y="180px">
        <Typography variant="caption" color="text.secondary" align="center">
          <Trans i18nKey="home-experience.team" />
        </Typography>
      </Absolute>
      <IconGroup x="75px" y="75px">
        <FaJava color="#954024" size={18} />
        <FaJs color="#12507b" size={18} />
        <FaPython color="#3271ae" size={18} />
        <SiLatex color="#ef845d" size={18} />
      </IconGroup>
      <IconGroup x="225px" y="75px">
        <SiAdobephotoshop color="#a67eb7" size={18} />
        <SiAdobeillustrator color="#4c8045" size={18} />
        <SiAdobelightroom color="#68945c" size={18} />
        <SiBlender color="#bba1cb" size={18} />
      </IconGroup>
      <IconGroup x="225px" y="225px">
        <FaSwimmer color="#779649" size={18} />
        <FaDumbbell color="#e18a3b" size={18} />
        <MdOutlineSportsTennis color="#dc6b82" size={18} />
        <FaCamera color="#a67eb7" size={18} />
      </IconGroup>
      <IconGroup x="75px" y="225px">
        <SiMojangstudios color="#dc6b82" size={18} />
        <Typography variant="body2">BF</Typography>
        <Typography variant="body2">AOE4</Typography>
      </IconGroup>
    </FlexBox>
  );
};

const Collage: React.FC = () => {
  const isSmallMedia = useSmallMedia();
  return (
    <Wrapper
      bgcolor="background.default"
      sx={{ flexDirection: "row", flexWrap: isSmallMedia ? "wrap" : "nowrap" }}
    >
      <FlexBox flexDirection="column" gap={3}>
        <FlexBox flexDirection="column" gap={1}>
          <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
            <Trans i18nKey="home-experience.collageLife" />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Trans i18nKey="home-experience.abstract" />
          </Typography>
        </FlexBox>
        <Typography>
          <Trans i18nKey="home-experience.collageAbstract" />
        </Typography>
      </FlexBox>
      <FlexBox sx={{ position: "relative" }}>
        <CollageImg />
      </FlexBox>
    </Wrapper>
  );
};

export default Collage;
