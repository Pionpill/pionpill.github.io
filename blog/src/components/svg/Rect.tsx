import { ReactNode } from "react";
import Degree from "../../styles";
import { common } from "../../styles/themes";

type Props = {
  x: string;
  y: string;
  offsetX?: string;
  offsetY?: string;
  width: string;
  height: string;
  fill?: string;
  stroke?: string;
  radius?: Degree | "ellipse";
  shadow?: boolean;
  notCenter?: boolean;
  opacity?: string;
  children?: ReactNode;
};

const Rect: React.FC<Props> = ({
  x,
  y,
  offsetX,
  offsetY,
  width,
  height,
  fill,
  stroke,
  radius,
  shadow,
  notCenter,
  opacity,
  children,
}) => {
  let realX = notCenter ? x : `${Number(x) - Number(width) / 2}`;
  let realY = notCenter ? y : `${Number(y) - Number(height) / 2}`;
  realX = offsetX ? `${Number(realX) + Number(offsetX)}` : realX;
  realY = offsetY ? `${Number(realY) + Number(offsetY)}` : realY;
  const realRadius =
    radius === "xxs"
      ? "3"
      : radius === "xs"
      ? "5"
      : radius === "sm"
      ? "9"
      : radius === "md"
      ? "12"
      : radius === "lg"
      ? "16"
      : radius === "xl"
      ? "24"
      : radius === "xxl"
      ? "32"
      : radius === "ellipse"
      ? height > width
        ? `${Number(width) / 2}`
        : `${Number(height) / 2}`
      : "5";
  const realFill = fill ? fill : common.button_default;
  const realStroke = stroke ? stroke : "none";

  return (
    <>
      {shadow && (
        <rect
          x={realX}
          y={realY}
          width={width}
          height={height}
          rx={realRadius}
          ry={realRadius}
          fill="#000000"
          stroke="#000000"
          pointer-events="all"
          transform="translate(2,3)"
          opacity="0.25"
        ></rect>
      )}

      <rect
        x={realX}
        y={realY}
        width={width}
        height={height}
        rx={realRadius}
        ry={realRadius}
        fill={realFill}
        stroke={realStroke}
        pointer-events="all"
        opacity={opacity}
      >
        {children}
      </rect>
    </>
  );
};

export default Rect;
