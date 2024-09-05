import { Avatar, Typography } from "@mui/material";
import { blue, purple, red, teal } from "@mui/material/colors";
import { Trans } from "react-i18next";
import { FaLaptopCode } from "react-icons/fa";
import { GoDeviceCameraVideo } from "react-icons/go";
import { IoIosHome } from "react-icons/io";
import { RiUserLocationFill } from "react-icons/ri";
import {
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBlender,
  SiVisualstudiocode,
} from "react-icons/si";
import Brand from "../../components/Brand";
import FlexBox from "../../components/FlexBox";
import { github_avatar } from "../../shared/config";
import { flexCenter, icon128x } from "../../styles/macro";

const Info: React.FC = () => {
  return (
    <FlexBox
      sx={{
        flexDirection: "column",
        backgroundSize: "cover",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "1",
        width: "100%",
        height: "500px",
        pb: 3,
        background: `linear-gradient( rgba(255, 255, 255, 0) 25%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.75) 100%), url("https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/works/gaea/lake-1.jpg?imageMogr2/thumbnail/945x") no-repeat center`,
        WebkitBackgroundSize: "cover",
      }}
      gap={2}
    >
      <Avatar alt="pionpill" src={github_avatar} sx={icon128x}/>
      <Typography variant="h3" fontWeight="fontWeightBold" color="white">
        北岸 Pionpill
      </Typography>
      <FlexBox gap={2} sx={{ color: "white", ...flexCenter }}>
        <Typography color="white" sx={flexCenter} gap={1}>
          <RiUserLocationFill />
          <Trans i18nKey="home.location" />
        </Typography>
        <Typography color="white" sx={flexCenter} gap={1}>
          <IoIosHome />
          <Trans i18nKey="home.home" />
        </Typography>
        <Typography color="white" sx={flexCenter} gap={1}>
          <FaLaptopCode />
          <Trans i18nKey="home.state" />
        </Typography>
      </FlexBox>
      <Typography color="white" align="center">
        <Trans i18nKey="home.title" />
      </Typography>
      <FlexBox
        sx={{ flexWrap: "wrap", ...flexCenter, justifyContent: "center" }}
        gap={1}
      >
        <Brand
          label="Java"
          size="small"
          sx={{ backgroundColor: red[500], color: "white" }}
        />
        <Brand
          label="TypeScript"
          size="small"
          sx={{ backgroundColor: blue[500], color: "white" }}
        />
        <Brand
          label="React"
          size="small"
          sx={{ backgroundColor: blue[500], color: "white" }}
        />
        <Brand
          label="Minecraft"
          size="small"
          sx={{ backgroundColor: purple[500], color: "white" }}
        />
        <Brand
          label="Python"
          size="small"
          sx={{ backgroundColor: teal[500], color: "white" }}
        />
        <Brand
          label="Latex"
          size="small"
          sx={{ backgroundColor: teal[500], color: "white" }}
        />
      </FlexBox>
      <FlexBox gap={1}>
        <SiAdobephotoshop color="#fff" title="PhotoShop" />
        <SiAdobeillustrator color="#fff" title="Illustrator" />
        <SiAdobepremierepro color="#fff" title="Premiere Pro" />
        <SiAdobelightroom color="#fff" title="Lightroom" />
        <SiAdobeindesign color="#fff" title="InDesign" />
        <SiBlender color="#fff" title="Blender" />
        <SiVisualstudiocode color="#fff" title="VSCode" />
        <GoDeviceCameraVideo color="#fff" title="photography" />
      </FlexBox>
    </FlexBox>
  );
};

export default Info;
