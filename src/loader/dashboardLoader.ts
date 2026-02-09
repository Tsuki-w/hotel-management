import {
  getStaysAfterDate,
  getBookingsAfterDate,
  getStaysTodayActivity,
} from "@/services/apiBookings";
import type { QueryClient } from "@tanstack/react-query";
import { subDays } from "date-fns";
import type { LoaderFunctionArgs } from "react-router-dom"; // 引入类型

export const stayAfterDateQuery = (date: string) => ({
  queryKey: ["stayAfterDate", date],
  queryFn: () => getStaysAfterDate(date),
});

export const bookingsAfterDateQuery = (date: string) => ({
  queryKey: ["bookingsAfterDate", date],
  queryFn: () => getBookingsAfterDate(date),
});

export const todayActivityQuery = () => ({
  queryKey: ["todayActivity"],
  queryFn: () => getStaysTodayActivity(),
});

export const dashboardLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const numDays = Number(url.searchParams.get("last") || "7");
    // 统一使用 setHours(0,0,0,0) 确保 Loader 和组件生成的时间字符串完全一致
    const queryDate = subDays(
      new Date().setHours(0, 0, 0, 0),
      numDays,
    ).toISOString();
    return await Promise.all([
      queryClient.ensureQueryData(stayAfterDateQuery(queryDate)),
      queryClient.ensureQueryData(bookingsAfterDateQuery(queryDate)),
      queryClient.ensureQueryData(todayActivityQuery()),
    ]);
  };
