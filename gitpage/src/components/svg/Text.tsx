import { ReactNode } from "react";

type Props = {
  x: string;
  y: string;
  offsetX?: string;
  offsetY?: string;
  size?: number;
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
  const fontSize = size ? String(size * 8) : "16";
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
      fontSize={fontSize}
      fill={fill ? fill : "white"}
      textAnchor={anchor ? anchor : "middle"}
    >
      {children}
    </text>
  );
};

export default Text;
