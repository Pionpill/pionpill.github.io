import AMapLoader from "@amap/amap-jsapi-loader";
import {
  faBaby,
  faChild,
  faEllipsis,
  faGraduationCap,
  faTrain,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import Button from "../../../components/Button";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { coordinate } from "../../../shared/coordinate";
import { spacing } from "../../../styles/measure";
import { token } from "../../../tokens/token";

const Card: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const bgColor = useThemeChoice("#fafafa", "#3a3a3a");
  return (
    <Flex
      style={{
        minWidth: "64px",
        minHeight: "64px",
        backgroundColor: bgColor,
        borderRadius: "4px",
      }}
    >
      {children}
    </Flex>
  );
};

const Teen: React.FC = () => {
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
        center: coordinate.hometown,
        mapStyle: mapStyle,
      });
    });
  });

  const changeCenter = (center: [number, number], zoom?: number) => {
    console.log("尝试切换坐标");
    map.current.setCenter(center);
    if (zoom) {
      map.current.setZoom(zoom);
    }
  };

  return (
    <Flex bgSecond fullWidth>
      <Flex column gap="xl" bleed limitWidth>
        <H2>学生时代</H2>
        <Flex style={{ width: "80vw" }} gap="xl">
          <Flex
            ref={mapContainer}
            style={{
              width: "100%",
              maxWidth: spacing.mainWidth,
              height: "500px",
            }}
          />
        </Flex>
        <Flex wrap align="flex-start" gap="lg">
          <Flex column style={{ minWidth: "110px", minHeight: "220px" }}>
            <Card>
              <FontAwesomeIcon icon={faBaby} size="2x" color="#dd7694" />
            </Card>
            <Flex column gap="xs" style={{ maxWidth: "150px" }}>
              <P weight="xl" size="lg">
                <Button
                  onClick={() => changeCenter([113.159617, 30.64309], 12)}
                  textColor="link"
                  weight="xl"
                  size="lg"
                >
                  湖北省天门市
                </Button>
              </P>
              <P center weight="sm">
                出生于一个普普通通的农村家庭，在这里上过幼儿园
              </P>
            </Flex>
            <P weight="xl" shallow="md" style={{ justifySelf: "flex-end" }}>
              2000 - 2006
            </P>
          </Flex>
          <Flex column style={{ minWidth: "110px", minHeight: "220px" }}>
            <Card>
              <FontAwesomeIcon icon={faChild} size="2x" color="#80a492" />
            </Card>
            <Flex column gap="xs" style={{ maxWidth: "150px" }}>
              <Button
                onClick={() => changeCenter([120.282231, 31.494045], 12)}
                textColor="link"
                weight="xl"
                size="lg"
              >
                江苏省无锡市
              </Button>
              <P center weight="sm">
                在这里度过了学生时代，就读于
                <Button
                  textColor="link"
                  weight="lg"
                  onClick={() => changeCenter([120.278002, 31.605755], 16)}
                >
                  吴桥实小
                </Button>
                &nbsp;·&nbsp;
                <Button
                  textColor="link"
                  weight="lg"
                  onClick={() => changeCenter([120.291119, 31.607393], 16)}
                >
                  凤翔中学
                </Button>
                &nbsp;·&nbsp;
                <Button
                  textColor="link"
                  weight="lg"
                  onClick={() => changeCenter([120.286693, 31.492004], 16)}
                >
                  太湖高中
                </Button>
              </P>
            </Flex>
            <P weight="xl" shallow="md" style={{ justifySelf: "flex-end" }}>
              2006 - 2019
            </P>
          </Flex>
          <Flex column style={{ minWidth: "110px", minHeight: "220px" }}>
            <Card>
              <FontAwesomeIcon
                icon={faGraduationCap}
                size="2x"
                color="#6b798e"
              />
            </Card>
            <Flex column gap="xs" style={{ maxWidth: "150px" }}>
              <P weight="xl" size="lg">
                江苏省南京市
              </P>
              <P center weight="sm">
                <Button
                  textColor="link"
                  weight="lg"
                  onClick={() => changeCenter([113.159617, 30.64309], 12)}
                >
                  南京信息工程大学
                </Button>
                本科，就读于软件学院软件工程系
              </P>
            </Flex>
            <P weight="xl" shallow="md" style={{ justifySelf: "flex-end" }}>
              2019 - 2023
            </P>
          </Flex>
          <Flex column style={{ minWidth: "110px", minHeight: "220px" }}>
            <Card>
              <FontAwesomeIcon icon={faTrain} size="2x" color="#354e6b" />
            </Card>
            <Flex column gap="xs" style={{ maxWidth: "150px" }}>
              <P weight="xl" size="lg">
                江苏，上海，杭州
              </P>
              <P center weight="sm">
                于无锡{" "}
                <Button
                  textColor="link"
                  weight="lg"
                  onClick={() => changeCenter([120.305619, 31.490248], 17)}
                >
                  国联证券
                </Button>
                实习，正在寻找一份长三角的工作
              </P>
            </Flex>
            <P weight="xl" shallow="md" style={{ justifySelf: "flex-end" }}>
              2023 - <FontAwesomeIcon icon={faEllipsis} />
            </P>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Teen;
