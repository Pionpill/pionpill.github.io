import { Skeleton } from "@mui/material";
import { max, range } from "d3-array";
import { scaleQuantize, scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";
import { select, Selection } from "d3-selection";
import { useCallback, useEffect, useRef } from "react";

type CalendarChartItem = {
  date: Date;
  value: number;
  [key: string]: any;
};

export interface CalendarChartProps {
  data: Array<CalendarChartItem>;
  darkMode?: boolean;
  vertical?: boolean;
  ordinal?: boolean; // 离散颜色映射
  title?: string;
  maxValue?: number;
  hoverTextFn?: (item: CalendarChartItem) => string;
  colorMapFn?: (item: CalendarChartItem) => (value: number) => string;
}

const CalendarChart: React.FC<CalendarChartProps> = (props) => {
  const { data, darkMode, vertical, ordinal, title, maxValue, ...otherProps } =
    props;
  const { hoverTextFn, colorMapFn, ...styleProps } = otherProps;

  const svgRef = useRef<SVGSVGElement>(null!);
  const tooltipRef = useRef<HTMLDivElement>(null!);
  const selectionRef = useRef<{
    dots: Selection<SVGRectElement, string, SVGSVGElement, unknown> | null;
    month: Selection<SVGTextElement, string, SVGSVGElement, unknown> | null;
    weekday: Selection<SVGTextElement, string, SVGSVGElement, unknown> | null;
    title: Selection<SVGTextElement, string, SVGSVGElement, unknown> | null;
  }>({
    dots: null,
    month: null,
    weekday: null,
    title: null,
  });

  const config = {
    chartOffset: [40, title ? 70 : 20],
    rectSize: [16, 16],
    rectGap: [4, 4],
    size: !vertical ? [1100, title ? 230 : 180] : [title ? 230 : 180, 1100],
  };

  const getRectColor = useCallback(
    (item: CalendarChartItem) => {
      if (!svgRef.current || !data) return "#EBEDF0";
      const realColorMapFn = colorMapFn ? colorMapFn : () => interpolateBlues;
      const domain = [0, maxValue || max(data, (item) => item.value) as number];

      const colorScale = !ordinal
        ? scaleSequential(domain, [
            realColorMapFn(item)(darkMode ? 1 : 0.1),
            realColorMapFn(item)(darkMode ? 0.1 : 1),
          ])
        : scaleQuantize(
            domain,
            range(0.1, 1, 0.2).map((value) => realColorMapFn(item)(value))
          );
      return item.value
        ? colorScale(item.value)
        : darkMode
        ? "#2F2F2F"
        : "#EBEDF0";
    },
    [colorMapFn, data, darkMode]
  );

  // 更新元素颜色
  useEffect(() => {
    if (!data) return;
    const textColor =
      darkMode === undefined ? "currentColor" : darkMode ? "white" : "black";
    if (selectionRef.current.title) {
      selectionRef.current.title.attr("fill", textColor);
    }
    if (selectionRef.current.month) {
      selectionRef.current.month.attr("fill", textColor);
    }
    if (selectionRef.current.weekday) {
      selectionRef.current.weekday.attr("fill", textColor);
    }
    if (selectionRef.current.dots) {
      selectionRef.current.dots.attr("fill", getRectColor as any);
    }
  }, [darkMode]);

  // 坐标轴初始化
  useEffect(() => {
    if (!svgRef.current || !data) return;
    const { chartOffset, rectSize, rectGap, size } = config;
    const textColor =
      darkMode === undefined ? "currentColor" : darkMode ? "white" : "black";

    if (title) {
      selectionRef.current.title = select(svgRef.current)
        .selectAll("title")
        .data([title])
        .enter()
        .append("text")
        .attr("x", size[0] / 2)
        .attr("y", 25)
        .attr("fill", textColor)
        .attr("font-size", "22px")
        .attr("font-weight", "bold")
        .attr("opacity", 0.8)
        .attr("text-anchor", "middle")
        .text(title);
    }

    const xAxios = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (data[0].date.getMonth() === data[data.length - 1].date.getMonth()) {
      xAxios.push("Jan");
    }
    const yAxios = ["Mon", "Wed", "Fri"];
    let dataIndex = 0;
    let lastMonth = data[0].date.getMonth();
    const startMonth = data[0].date.getMonth();
    const getMonthPosition = () => {
      const result =
        chartOffset[0] + (rectSize[0] + rectGap[0]) * (dataIndex / 7);
      while (data[dataIndex]?.date.getMonth() === lastMonth) {
        dataIndex += 7;
      }
      lastMonth = (lastMonth + 1) % 12;
      return result;
    };
    selectionRef.current.month = select(svgRef.current)
      .selectAll("monthSelection")
      .data(xAxios)
      .enter()
      .append("text")
      .attr("x", () => (vertical ? 0 : getMonthPosition()))
      .attr("y", () => (vertical ? getMonthPosition() : chartOffset[1] - 10))
      .attr("fill", textColor)
      .attr("font-size", "14px")
      .text((_, index) => xAxios[(index + startMonth) % 12]);

    selectionRef.current.weekday = select(svgRef.current)
      .selectAll("weekdaySelection")
      .data(yAxios)
      .enter()
      .append("text")
      .attr("x", (_, index) =>
        vertical
          ? chartOffset[1] + (index + 1) * (rectSize[1] + rectGap[1]) * 2 - 6
          : 0
      )
      .attr("y", (_, index) =>
        vertical
          ? 18
          : chartOffset[1] + (index + 1) * (rectSize[1] + rectGap[1]) * 2 - 4
      )
      .attr("fill", textColor)
      .attr("font-size", "14px")
      .text((data) => data);

    return () => {
      selectionRef.current.title?.remove();
      selectionRef.current.month?.remove();
      selectionRef.current.weekday?.remove();
    };
  }, [data, vertical]);

  // 数据初始化
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const { chartOffset, rectSize, rectGap } = config;

    const realHoverTextFn = hoverTextFn
      ? hoverTextFn
      : (item: CalendarChartItem) =>
          `${item.date.toLocaleDateString()}: ${item.value}`;

    const startDay = data[0].date.getDay();
    const tooltip = select(tooltipRef.current);

    selectionRef.current.dots = select(svgRef.current)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, index) => {
        if (vertical) {
          const rowIndex = (index + startDay) % 7;
          return rowIndex * (rectSize[0] + rectGap[0]) + chartOffset[0];
        }
        const colIndex = Math.floor((index + startDay) / 7);
        return colIndex * (rectSize[0] + rectGap[0]) + chartOffset[0];
      })
      .attr("y", (_, index) => {
        if (vertical) {
          const colIndex = Math.floor((index + startDay) / 7);
          return colIndex * (rectSize[1] + rectGap[1]) + chartOffset[1];
        }
        const rowIndex = (index + startDay) % 7;
        return rowIndex * (rectSize[1] + rectGap[1]) + chartOffset[1];
      })
      .attr("width", rectSize[0])
      .attr("height", rectSize[1])
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", getRectColor)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        tooltip
          .style("display", "block")
          .html(realHoverTextFn(d))
          .style("border-color", getRectColor(d))
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY - 40 + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY - 40 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      }) as any;

    return () => {
      selectionRef.current.dots?.remove();
    };
  }, [data, vertical]);

  return (
    <>
      {data ? (
        <div style={{ position: "relative", ...styleProps }}>
          <svg width={config.size[0]} height={config.size[1]} ref={svgRef} />
          <span
            ref={tooltipRef}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "white",
              border: "2px solid black",
              borderRadius: "4px",
              padding: "4px",
              color: "black",
              display: "none",
              zIndex: 999,
              transform: "translate(-50%)",
            }}
          />
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          width={config.size[0]}
          height={config.size[1]}
        />
      )}
    </>
  );
};

export default CalendarChart;
