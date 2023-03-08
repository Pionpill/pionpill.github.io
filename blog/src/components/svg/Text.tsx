import { ReactNode } from "react";
import Degree from "../../styles";
import { fontSizeSelector } from "../../utils/styledUtils";

type Props = {
  x: string;
  y: string;
  offsetX?: string;
  offsetY?: string;
  size?: Degree;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  children?: ReactNode;
};

const Text: React.FC<Props> = ({
  x,
  y,
  offsetX,
  offsetY,
  size,
  fill,
  anchor,
  children,
}) => {
  const fontSize = fontSizeSelector(size).replace("px", "");
  let realX = x;
  let realY = `${
    Number(y) + Number(fontSize) / 2 - (Number(fontSize) / 2 ? 0.5 : 0)
  }`;
  realX = offsetX ? `${Number(realX) + Number(offsetX)}` : realX;
  realY = offsetY ? `${Number(realY) + Number(offsetY)}` : realY;
  return (
    <text
      x={realX}
      y={realY}
      font-size={fontSize}
      fill={fill ? fill : "white"}
      text-anchor={anchor ? anchor : "middle"}
    >
      {children}
    </text>
  );
};

export default Text;
