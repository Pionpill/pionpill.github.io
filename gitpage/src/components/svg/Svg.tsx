import React, { CSSProperties, ReactNode } from "react";

type Props = {
  id?: string;
  width?: string;
  height?: string;
  iconSize?: number;
  x?: string;
  y?: string;
  offsetX?: string;
  offsetY?: string;
  style?: CSSProperties;
  children?: ReactNode;
  zoom?: boolean;
  viewBox?: string;
  center?: boolean;
};

const Svg: React.FC<Props> = ({
  x,
  y,
  offsetX,
  offsetY,
  id,
  width,
  height,
  iconSize,
  viewBox,
  center,
  style,
  children,
}) => {
  const realIconSize = iconSize ? String(iconSize * 8) : "32";
  const realWidth = width ? width : realIconSize;
  const realHeight = height ? height : realIconSize;
  let realX = center ? `${Number(x) - Number(realWidth) / 2}` : x;
  let realY = center ? `${Number(y) - Number(realHeight) / 2}` : y;
  realX = offsetX ? `${Number(realX) + Number(offsetX)}` : realX;
  realY = offsetY ? `${Number(realY) + Number(offsetY)}` : realY;

  return (
    <svg
      x={realX}
      y={realY}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
      width={realWidth}
      height={realHeight}
      style={style}
      viewBox={viewBox ? viewBox : `0 0 ${width} ${height}`}
    >
      {children}
    </svg>
  );
};

export default Svg;
