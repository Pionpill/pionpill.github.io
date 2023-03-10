import {
  BarChart,
  HeatmapChart,
  LineChart,
  SunburstChart,
} from "echarts/charts";
import {
  CalendarComponent,
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { ECBasicOption } from "echarts/types/dist/shared";
import React from "react";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  SunburstChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  HeatmapChart,
  VisualMapComponent,
  CalendarComponent,
]);

type Props = {
  options: ECBasicOption;
};

const EChart: React.FC<Props> = ({ options }) => {
  const chartRef = React.useRef<any>(null);

  React.useEffect(() => {
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    chart.setOption(options);
  });

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default EChart;
