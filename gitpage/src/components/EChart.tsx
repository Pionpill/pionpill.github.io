import * as echarts from "echarts/core";
import { ECBasicOption } from "echarts/types/dist/shared";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores";

type Props = {
  components: any[];
  options: ECBasicOption;
};

const EChart: React.FC<Props> = ({ components, options }) => {
  const theme = useSelector((state: RootState) => state.app.theme);
  const chartRef = React.useRef<HTMLDivElement>(null!);
  echarts.use(components);

  React.useEffect(() => {
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    chart.setOption(options);
  }, [theme]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default EChart;
