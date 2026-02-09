import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features"; //标签自动布局、全局过渡动画等特性
import { CanvasRenderer } from "echarts/renderers"; //Canvas 渲染器
import styled from "styled-components";
import Heading from "@/ui/Heading";
import { useRef, useEffect, useMemo, useContext } from "react";
import type { EChartsCoreOption } from "echarts/core";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import type { TBookingsAfterDate } from "@/types/booking";
import { DarkModeContext } from "@/context/DarkModeContext";

const DashboardBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  VisualMapComponent,
]);

type IProps = {
  bookings: TBookingsAfterDate[];
  numDays: number;
};

const SalesChart = ({ bookings, numDays }: IProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const chartRef = useRef<HTMLDivElement>(null); //echarts需要挂载的DOM结点
  const chartInstance = useRef<echarts.ECharts | null>(null); //存储 echarts.init() 返回的实例。用于调用 setOption、resize 或销毁图表
  // 返回指定天数前到今天为止的所有时间
  const allDates = useMemo(
    () =>
      eachDayOfInterval({
        start: subDays(new Date(), numDays - 1),
        end: new Date(),
      }),
    [numDays],
  );
  // 根据时间生成对应图表数据
  const data = useMemo(
    () =>
      allDates.map((date) => {
        return {
          label: format(date, "MM月dd日"),
          // 累加当天的所有数据
          totalSales: bookings
            .filter((booking) => isSameDay(date, new Date(booking.created_at)))
            .reduce((acc, cur) => acc + cur.totalPrice, 0),
          extrasSales: bookings
            .filter((booking) => isSameDay(date, new Date(booking.created_at)))
            .reduce((acc, cur) => acc + cur.extrasPrice, 0),
        };
      }),
    [bookings, allDates],
  );
  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 处理窗口缩放
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose(); // 销毁实例，防止内存泄漏
    };
  }, []);

  // 监听数据变化，更新图表
  useEffect(() => {
    // 定义配置
    if (chartInstance.current) {
      setTimeout(() => {
        const getStyle = (name: string) =>
          // 获取对应结点所有的计算样式并根据name返回值
          getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        const colors = {
          totalSales: {
            stroke: getStyle("--color-brand-600"),
            fill: getStyle("--color-brand-200"),
          },
          extrasSales: {
            stroke: getStyle("--color-green-700"),
            fill: getStyle("--color-green-100"),
          },
          text: getStyle("--color-grey-500"),
          background: getStyle("--color-grey-0"),
        };
        const option: EChartsCoreOption = {
          title: {
            text: "销售报表",
          },
          tooltip: {
            trigger: "axis",
            backgroundColor: colors.background,
            textStyle: {
              color: colors.text,
            },
          },
          // 绘图网格
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          // x轴
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: data.map((d) => d.label),
            axisLabel: {
              color: colors.text,
            },
            axisLine: {
              lineStyle: {
                color: colors.text,
              },
            },
          },
          // y轴 不指定data，ECharts 会根据 series 中的数值自动计算最大值和最小值
          yAxis: {
            type: "value",
            axisLabel: {
              color: colors.text,
            },
            splitLine: {
              lineStyle: {
                color: "#e5e7eb",
                type: "dashed",
              },
            },
          },
          series: [
            {
              name: "总销售额",
              type: "line",
              smooth: true,
              data: data.map((d) => d.totalSales),
              lineStyle: {
                color: colors.totalSales.stroke,
                width: 2,
              },
              areaStyle: {
                color: colors.totalSales.fill,
              },
              itemStyle: {
                color: colors.totalSales.stroke,
              },
            },
            {
              name: "额外销售额",
              type: "line",
              smooth: true,
              data: data.map((d) => d.extrasSales),
              lineStyle: {
                color: colors.extrasSales.stroke,
                width: 2,
              },
              areaStyle: {
                color: colors.extrasSales.fill,
              },
              itemStyle: {
                color: colors.extrasSales.stroke,
              },
            },
          ],
        };
        chartInstance.current?.setOption(option);
      }, 0);
    }
  }, [data, isDarkMode]);
  return (
    <StyledSalesChart>
      <Heading as="h2">
        销售额 {format(allDates.at(0)!, "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1)!, "MMM dd yyyy")}
      </Heading>
      <div ref={chartRef} style={{ width: "100%", height: "300px" }}></div>
    </StyledSalesChart>
  );
};

export default SalesChart;
