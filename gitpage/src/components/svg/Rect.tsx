import { lightBlue } from "@mui/material/colors";
import { ReactNode } from "react";

type Props = {
  x: string;
  y: string;
  offsetX?: string;
  offsetY?: string;
  width: string;
  height: string;
  fill?: string;
  stroke?: string;
  radius?: number | "ellipse";
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
  const realRadius = radius
    ? radius === "ellipse"
      ? height > width
        ? `${Number(width) / 2}`
        : `${Number(height) / 2}`
      : String(radius * 8)
    : "8";
  const realFill = fill ? fill : lightBlue[800];
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
          pointerEvents="all"
          transform="translate(2,3)"
          opacity="0.25"
        />
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
        pointerEvents="all"
        opacity={opacity}
      >
        {children}
      </rect>
    </>
  );
};

export default Rect;
