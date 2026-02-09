import type { TStaysAfterDate } from "@/types/booking";
import styled from "styled-components";
import Heading from "@/ui/Heading";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef, useMemo, useContext } from "react";
import type { EChartsCoreOption } from "echarts/core";
import { DarkModeContext } from "@/context/DarkModeContext";

const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  GridComponent,
]);

const startDataLight = [
  {
    duration: "1晚",
    value: 0,
    color: "#ef4444",
  },
  {
    duration: "2晚",
    value: 0,
    color: "#f97316",
  },
  {
    duration: "3晚",
    value: 0,
    color: "#eab308",
  },
  {
    duration: "4-5晚",
    value: 0,
    color: "#84cc16",
  },
  {
    duration: "6-7晚",
    value: 0,
    color: "#22c55e",
  },
  {
    duration: "8-14晚",
    value: 0,
    color: "#14b8a6",
  },
  {
    duration: "15-21晚",
    value: 0,
    color: "#3b82f6",
  },
  {
    duration: "21晚以上",
    value: 0,
    color: "#a855f7",
  },
];

const startDataDark = [
  {
    duration: "1晚",
    value: 0,
    color: "#b91c1c",
  },
  {
    duration: "2晚",
    value: 0,
    color: "#c2410c",
  },
  {
    duration: "3晚",
    value: 0,
    color: "#a16207",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#4d7c0f",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#15803d",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#0f766e",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#1d4ed8",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#7e22ce",
  },
];

type IProps = {
  confirmStays: TStaysAfterDate[];
};

const DurationChart = ({ confirmStays }: IProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const startData = isDarkMode ? startDataDark : startDataLight;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const data = useMemo(() => {
    const data = startData.map((item) => ({ ...item, value: 0 }));
    confirmStays.forEach((stay) => {
      const num = stay.numNights;
      if (num === 1) data[0].value++;
      else if (num === 2) data[1].value++;
      else if (num === 3) data[2].value++;
      else if (num >= 4 && num <= 5) data[3].value++;
      else if (num >= 6 && num <= 7) data[4].value++;
      else if (num >= 8 && num <= 14) data[5].value++;
      else if (num >= 15 && num <= 21) data[6].value++;
      else if (num >= 21) data[7].value++;
    });
    return data;
  }, [startData, confirmStays]);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      // 放宏任务队列中去执行
      // DarkModeConTextProvider为当前组件的父组件，其useEffect会在当前组件的useEffect之后执行，不推迟则会导致getStyle读取的还是旧值
      setTimeout(() => {
        const getStyle = (name: string) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();

        const option: EChartsCoreOption = {
          backgroundColor: "transparent",
          tooltip: {
            trigger: "item",
            backgroundColor: getStyle("--color-grey-0"),
            borderColor: getStyle("--color-grey-100"),
            textStyle: {
              color: getStyle("--color-grey-700"),
            },
          },
          legend: {
            orient: "vertical",
            right: "0%",
            top: "middle",
            textStyle: {
              color: getStyle("--color-grey-700"),
            },
            itemWidth: 12,
            itemHeight: 12,
          },
          series: [
            {
              name: "入住时长",
              type: "pie",
              radius: ["50%", "70%"],
              center: ["40%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 4,
                borderColor: getStyle("--color-grey-0"),
                borderWidth: 2,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: getStyle("--color-grey-700"),
                },
              },
              data: data
                .filter((obj) => obj.value > 0)
                .map((obj) => ({
                  value: obj.value,
                  name: obj.duration,
                  itemStyle: { color: obj.color },
                })),
            },
          ],
        };
        chartInstance.current?.setOption(option);
      }, 0);
    }
  }, [data, isDarkMode]);

  return (
    <ChartBox>
      <Heading as="h2">入住时长统计</Heading>
      <div ref={chartRef} style={{ width: "100%", height: "240px" }}></div>
    </ChartBox>
  );
};

export default DurationChart;
