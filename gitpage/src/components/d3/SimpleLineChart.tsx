import { Skeleton } from "@mui/material";
import { blue } from "@mui/material/colors";
import { max } from "d3-array";
import { FC, useMemo, useRef } from "react";

type SimpleLineChartProps = {
  data: Array<{ name: string; value: number }>;
  width?: number;
  height?: number;
};

const SimpleLineChart: FC<SimpleLineChartProps> = (prop) => {
  const { data, width = 250, height = 50 } = prop;

  const svgRef = useRef<SVGSVGElement>(null!);

  const path = useMemo(() => {
    if (!data) return "";
    const maxValue = max(data, (item) => item.value)!;
    return data.reduce((acc, cur, index, arr) => {
      const dotHeight = maxValue
        ? Math.round((height * cur.value) / maxValue)
        : 0;
      const x = (index / arr.length) * width;
      const y = height - dotHeight + 2;
      const coordinate = `${index === 0 ? "M" : "L"}${x},${y} `;
      return acc + coordinate;
    }, "");
  }, [data]);

  return (
    <>
      {data ? (
        <svg width={width} height={height + 4} ref={svgRef}>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={blue[300]} stopOpacity="1" />
              <stop offset="100%" stopColor={blue[300]} stopOpacity="0" />
            </linearGradient>
            <clipPath id="clipPath">
              <path
                d={`M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height}`}
              />
            </clipPath>
          </defs>
          <path
            d={`${path}L${width},${height + 2} L${0},${height + 2}`}
            strokeWidth="0"
            fill="url(#grad1)"
          />
          <path
            d={path}
            strokeWidth="2"
            stroke={blue[800]}
            stroke-linejoin="round"
            stroke-linecap="round"
            fill="transparent"
          />
        </svg>
      ) : (
        <Skeleton width={width} height={height + 4} />
      )}
    </>
  );
};

export default SimpleLineChart;
