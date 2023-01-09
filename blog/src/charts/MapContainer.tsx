import mapboxgl from "mapbox-gl";
import React from "react";
import styled from "styled-components";
import Flex from "../components/Flex";
import { token } from "../tokens/token";

const styleSelector = (style: string | undefined) => {
  const prefix = "mapbox://styles/mapbox/";
  if (style === "street") return prefix + "streets-v12";
  else if (style === "outdoors") return prefix + "outdoors-v12";
  else if (style === "light") return prefix + "light-v11";
  else if (style === "dark") return prefix + "dark-v11";
  else if (style === "satellite") return prefix + "satellite-v9";
  else if (style === "satellite-streets")
    return prefix + "satellite-streets-v12";
  else if (style === "navigation-day") return prefix + "navigation-day-v1";
  else if (style === "navigation") return prefix + "navigation-night-v1";
  else return prefix + "dark-v11";
};

type WrapperProps = {
  height?: string;
};

const Wrapper = styled(Flex)<WrapperProps>`
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  flex-direction: column;
`;

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
  height?: string;
  width?: string;
  zoom?: number;
  cube?: boolean;
};

export const MapContainer: React.FC<Props> = ({
  styled,
  coordinate,
  width,
  height,
  zoom = 13,
  cube = false,
}) => {
  const mapContainer = React.useRef<any>(null);
  const map = React.useRef<any>(null);
  mapboxgl.accessToken = token.mapbox;

  React.useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      style: styleSelector(styled),
      center: coordinate,
      zoom: zoom,
      minZoom: 1,
      maxZoom: 19,
      pitch: cube ? 45 : 0,
      container: mapContainer.current,
      attributionControl: false,
      antialias: true,
    });

    cube &&
      map.current.on("style.load", () => {
        const layers = map.current.getStyle().layers;
        const labelLayerId = layers.find(
          (layer: { type: string; layout: { [x: string]: any } }) =>
            layer.type === "symbol" && layer.layout["text-field"]
        ).id;
        map.current.addLayer(
          {
            id: "add-3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#444",
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"],
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "min_height"],
              ],
              "fill-extrusion-opacity": 0.6,
            },
          },
          labelLayerId
        );
      });
  });

  return <Wrapper ref={mapContainer} height={height} width={width} />;
};
