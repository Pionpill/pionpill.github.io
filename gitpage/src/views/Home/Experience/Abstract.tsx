import AMapLoader from "@amap/amap-jsapi-loader";
import { Avatar, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { PropsWithChildren, ReactNode } from "react";
import { Trans } from "react-i18next";
import { BiCodeBlock } from "react-icons/bi";
import { FaBaby, FaSchool } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { token } from "../../../shared/token";
import { icon56x } from "../../../styles/macro";
import { homeTheme } from "../../../styles/theme";

type AbstractItemProps = {
  icon: ReactNode;
  titleI18nKey: string;
  timePeriod: string;
};

const AbstractItem: React.FC<PropsWithChildren<AbstractItemProps>> = ({
  icon,
  titleI18nKey,
  children,
}) => {
  return (
    <FlexBox
      style={{
        width: "165px",
        flexDirection: "column",
        alignItems: "center",
      }}
      gap={2}
    >
      <Avatar
        sx={{
          borderRadius: "4px",
          ...icon56x,
          backgroundColor: homeTheme[100],
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" fontWeight="fontWeightBold" align="center">
        <Trans i18nKey={titleI18nKey} />
      </Typography>
      <Typography color="text.secondary" align="center">
        {children}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        2000 - 2006
      </Typography>
    </FlexBox>
  );
};

const Abstract: React.FC = () => {
  const mapContainer = React.useRef<any>(null);
  const map = React.useRef<any>(null);
  const mapKey = token.amap;
  const mapStyle = useThemeChoice(
    "amap://styles/whitesmoke",
    "amap://styles/dark"
  );

  React.useEffect(() => {
    AMapLoader.load({
      key: mapKey,
      version: "2.0",
      plugins: ["AMap.Geolocation"],
    }).then((AMap) => {
      AMap.plugin("AMap.Geolocation", () => {
        new AMap.Geolocation({
          enableHighAccuracy: false,
          timeout: 10000,
          offset: [10, 20],
          zoomToAccuracy: true,
          position: "RB",
        });
      });
      map.current = new AMap.Map(mapContainer.current, {
        viewMode: "3D",
        pitch: 30,
        zoom: 14,
        center: [113.127844, 30.723151],
        mapStyle: mapStyle,
      });
    });
  });

  const changeCenter = (center: [number, number], zoom?: number) => {
    map.current.setCenter(center);
    if (zoom) {
      map.current.setZoom(zoom);
    }
  };

  return (
    <Wrapper
      bgcolor={useThemeChoice(homeTheme[50], grey[900])}
      sx={{ justifyContent: "center" }}
    >
      <FlexBox gap={1} sx={{ flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" fontWeight="fontWeightBold">
          <Trans i18nKey="home-experience.track" />
        </Typography>
        <Typography color="text.secondary">
          <Trans i18nKey="home-experience.trackSubtitle" />
        </Typography>
      </FlexBox>
      <FlexBox
        ref={mapContainer}
        style={{
          width: "100%",
          height: "500px",
        }}
      />
      <FlexBox
        gap={3}
        sx={{
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <AbstractItem
          icon={<FaBaby size={36} color={homeTheme[900]} />}
          titleI18nKey="home-experience.homeAddress"
          timePeriod="2000 - 2006"
        >
          <Trans i18nKey="home-experience.homeContent" />
        </AbstractItem>
        <AbstractItem
          icon={<FaSchool size={36} color={homeTheme[900]} />}
          titleI18nKey="home-experience.wuxiAddress"
          timePeriod="2006 - 2019"
        >
          <Trans i18nKey="home-experience.wuxiContent" />
          <Button
            sx={{ p: 0 }}
            onClick={() => changeCenter([120.282231, 31.494045], 16)}
          >
            <Trans i18nKey="home-experience.wuxi-primary" />
          </Button>
          <Button
            sx={{ p: 0 }}
            onClick={() => changeCenter([120.291119, 31.607393], 16)}
          >
            <Trans i18nKey="home-experience.wuxi-junior" />
          </Button>
          <Button
            sx={{ p: 0 }}
            onClick={() => changeCenter([120.286791, 31.491981], 14)}
          >
            <Trans i18nKey="home-experience.wuxi-hight" />
          </Button>
        </AbstractItem>
        <AbstractItem
          icon={<GiGraduateCap size={36} color={homeTheme[900]} />}
          titleI18nKey="home-experience.collageAddress"
          timePeriod="2019 - 2023"
        >
          <Button
            sx={{ p: 0 }}
            onClick={() => changeCenter([118.718694, 32.205782], 15)}
          >
            <Trans i18nKey="home-experience.collage-nuist" />
          </Button>
          <Trans i18nKey="home-experience.collageContent" />
        </AbstractItem>
        <AbstractItem
          icon={<BiCodeBlock size={36} color={homeTheme[900]} />}
          titleI18nKey="home-experience.workingAddress"
          timePeriod="2019 - 2023"
        >
          <Trans i18nKey="home-experience.workingContent" />
        </AbstractItem>
      </FlexBox>
    </Wrapper>
  );
};

export default Abstract;
