import mapboxgl from "mapbox-gl";
import React from "react";
import { token } from "../tokens/token";

const styleSelector = (style: string | undefined) => {
  const prefix = "mapbox://styles/mapbox/";
  if (style === "street") return prefix + "streets-v12";
  else if (style === "outdoors") return prefix + "outdoor-v12";
  else if (style === "light") return prefix + "light-v11";
  else if (style === "dark") return prefix + "dark-v11";
  else if (style === "satellite") return prefix + "satellite-v9";
  else if (style === "satellite-streets")
    return prefix + "satellite-streets-v12";
  else if (style === "navigation-day") return prefix + "navigation-day-v1";
  else if (style === "navigation") return prefix + "navigation-night-v1";
  else return prefix + "dark-v11";
};

type Props = {
  styled?:
    | "street"
    | "outdoors"
    | "light"
    | "dark"
    | "satellite"
    | "satellite-streets"
    | "navigation-day"
    | "navigation";
  coordinate: [number, number];
};

export const Map: React.FC<Props> = ({ styled, coordinate }) => {
  React.useEffect(() => {
    mapboxgl.accessToken = token.mapbox;
    new mapboxgl.Map({
      style: styleSelector(styled),
      center: coordinate,
      zoom: 12,
      minZoom: 9,
      maxZoom: 19,
      // pitch: 45,
      bearing: -17.6,
      container: "map",
    });
  }, [coordinate, styled]);
  return (
    <>
      <div id="map" style={{ width: "100%", height: "100%" }} />
    </>
  );
};
