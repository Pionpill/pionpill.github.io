import AMapLoader from "@amap/amap-jsapi-loader";
import React from "react";
import styled from "styled-components";
import Flex from "../../../components/Flex";
import P from "../../../components/P";
import { coordinate } from "../../../shared/coordinate";
import { token } from "../../../tokens/token";
import { ContextWrapper, ImgWrapper, TextWrapper } from "./Wrapper";

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Span = styled.span`
  cursor: pointer;
  padding: 0em 0.25em;
  color: ${(props) => props.theme.pointer};
  font-weight: 600;
`;

const Li = styled.li`
  white-space: normal;
`;

const Ul = styled.ul`
  white-space: normal;
  padding-left: 0;
`;

export const Teen: React.FC = () => {
  const mapContainer = React.useRef<any>(null);
  const map = React.useRef<any>(null);
  const mapKey = token.amap;

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
        zoom: 14,
        center: coordinate.hometown,
        mapStyle: "amap://styles/dark",
      });
    });
  });

  const changeCenter = (center: [number, number], zoom?: number) => {
    console.log("123");
    map.current.setCenter(center);
    if (zoom) {
      map.current.setZoom(zoom);
    }
  };

  return (
    <ContextWrapper>
      <ImgWrapper>
        <Wrapper ref={mapContainer} />
      </ImgWrapper>
      <TextWrapper>
        <P size="xxl" weight="xl" space="huge">
          学生时代
        </P>
        <P>
          <Ul>
            <Li>
              2000 年生于
              <Span onClick={() => changeCenter([113.159617, 30.64309], 12)}>
                湖北省天门市
              </Span>
            </Li>
            <Li>
              2006 年来到
              <Span onClick={() => changeCenter([120.282231, 31.494045], 12)}>
                江苏省无锡市
              </Span>
            </Li>
            <Li>
              小学就读于
              <Span onClick={() => changeCenter([120.278002, 31.605755], 16)}>
                无锡吴桥实验小学
              </Span>
              ，原就读的小学拆了，并入吴桥实小。
            </Li>
            <Li>
              初中就读于
              <Span onClick={() => changeCenter([120.291119, 31.607393], 16)}>
                无锡凤翔实验中学
              </Span>
              ，小时候家里穷，直升入公办中学，初中成绩还可以，成功考入高中。
            </Li>
            <Li>
              高中就读于
              <Span onClick={() => changeCenter([120.286693, 31.492004], 16)}>
                江苏省太湖高级中学
              </Span>
              ，高考旧江苏卷, 选修物理生物获得双 A+,
              可惜不算入总分(江苏理科生落泪)。
            </Li>
            <Li>
              2019 年考入
              <Span onClick={() => changeCenter([118.717675, 32.203717], 15)}>
                南京信息工程大学
              </Span>
              计算机与软件学院(现在改名软件学院了)，软件工程系。
            </Li>
            <Li>
              2022 年前往无锡
              <Span onClick={() => changeCenter([120.305619, 31.490248], 17)}>
                国联证券
              </Span>
              技术总部实习
            </Li>
          </Ul>
        </P>
      </TextWrapper>
    </ContextWrapper>
  );
};
