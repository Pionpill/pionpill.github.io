import { ReactNode } from "react";
import TextRect from "../../../../components/svg/TextRect";
import Degree from "../../../../styles";
import { common } from "../../../../styles/themes";

type Props = {
  x: string;
  y: string;
  text: string;
  size?: Degree;
  width?: string;
  indent?: string;
  fill?: string;
  icon?: ReactNode;
  radius?: "sm" | "md" | "lg" | "ellipse";
  component?: boolean;
};

const SkillRectText: React.FC<Props> = ({
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
      radius={component ? "md" : radius}
      width={width ? width : component ? "120" : "170"}
      height={component ? "24" : "30"}
      size={size ? size : component ? "sm" : "md"}
      center
      opacity={component ? "0.9" : "1"}
      shadow={component ? false : true}
      indent={indent ? indent : "30"}
      fill={fill ? fill : common.xxxx}
      color={component ? "#eeeeee" : "white"}
      text={text}
      icon={icon}
    />
  );
};

export default SkillRectText;
