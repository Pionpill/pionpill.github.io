import mapboxgl from "mapbox-gl";
import React from "react";
import { token } from "../tokens/token";

export const Map: React.FC = () => {
  React.useEffect(() => {
    mapboxgl.accessToken = token.mapbox;
    //设置地图区域
    new mapboxgl.Map({
      style: "mapbox://styles/mapbox/dark-v11",
      center: [113.127844, 30.723151], //地图中心经纬度
      zoom: 12, //缩放级别
      minZoom: 9,
      maxZoom: 19,
      pitch: 45,
      bearing: -17.6,
      container: "map",
    });
  });
  return (
    <div>
      {/* 也可以添加style样式 包含 GL JS CSS 文件 */}
      {/* <link
        href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css"
        rel="stylesheet"
      /> */}
      <div
        id="map"
        style={{ width: "100%", height: "100%" }}
        className="marker"
      ></div>
    </div>
  );
};
