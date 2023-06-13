import { ReactNode } from "react";
import techColor from "../../styles/tech";
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
  size?: number;
  iconSize?: number;
  fill?: string;
  color?: string;
  stroke?: string;
  opacity?: string;
  radius?: number | "ellipse";
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
  const realIconSize: string = iconSize ? String(iconSize * 8) : "32";

  let realTextX: string = beginIndentX;
  let realIconX: string = String(
    Number(beginIndentX) + Number(realIconSize) * 1
  );
  let realIconY: string = String(Number(y) + 8);

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
          y={realIconY}
          viewBox="0 0 28 28"
          center
        >
          {icon}
        </Svg>
      )}
    </>
  );
};

export default TextRect;

type TechTextRectProps = {
  x: string;
  y: string;
  text: string;
  size?: number;
  width?: string;
  indent?: string;
  fill?: string;
  icon?: ReactNode;
  radius?: number | "ellipse";
  component?: boolean;
};

export const TechTextRect: React.FC<TechTextRectProps> = ({
  x,
  y,
  width,
  indent,
  fill,
  text,
  icon,
  size,
  radius,
  component,
}) => {
  return (
    <TextRect
      x={x}
      y={y}
      radius={component ? 2 : radius}
      width={width ? width : component ? "120" : "170"}
      height={component ? "24" : "30"}
      size={size ? size : component ? 1.5 : 2}
      center
      opacity={component ? "0.9" : "1"}
      shadow={component ? false : true}
      indent={indent ? indent : "30"}
      fill={fill ? fill : techColor.xxxx}
      color={component ? "#eeeeee" : "white"}
      text={text}
      icon={icon}
    />
  );
};
