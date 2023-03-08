import { ReactNode } from "react";
import Degree from "../../styles";
import { iconSizeSelector } from "../../utils/styledUtils";
import Rect from "./Rect";
import Svg from "./Svg";
import Text from "./Text";

type Props = {
  x: string;
  y: string;
  width: string;
  height: string;
  text?: string;
  shadow?: boolean;
  indent?: string;
  center?: boolean;
  icon?: ReactNode;
  size?: Degree;
  iconSize?: Degree;
  fill?: string;
  color?: string;
  stroke?: string;
  opacity?: string;
  radius?: "sm" | "md" | "lg" | "ellipse";
};

const TextRect: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  shadow,
  text,
  indent,
  center,
  color,
  icon,
  size,
  iconSize,
  fill,
  stroke,
  opacity,
  radius,
}) => {
  const beginX: number = Number(x) - Number(width) / 2;
  const beginIndentX: string = String(beginX + Number(indent ? indent : "0"));
  const realIconSize: string = iconSizeSelector(
    iconSize ? iconSize : "xs"
  ).replace("px", "");

  let realTextX: string = beginIndentX;
  let realIconX: string = String(
    Number(beginIndentX) + Number(realIconSize) * 1.5
  );

  if (icon) {
    realTextX = String(Number(realTextX) + Number(realIconSize) * 2);
  }

  if (center) {
    realTextX = String(Number(x) + (icon ? Number(realIconSize) / 2 : 0));
  }

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        shadow={shadow ? true : false}
        fill={fill}
        stroke={stroke}
        opacity={opacity}
        radius={radius}
      ></Rect>
      <Text
        x={realTextX}
        fill={color}
        size={size}
        y={y}
        anchor={center ? "middle" : "start"}
      >
        {text}
      </Text>
      {icon && (
        <Svg
          iconSize={iconSize}
          x={realIconX}
          y={y}
          viewBox="0 0 1024 1024"
          center
        >
          {icon}
        </Svg>
      )}
    </>
  );
};

export default TextRect;
