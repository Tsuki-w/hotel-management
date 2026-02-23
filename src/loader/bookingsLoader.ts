import { getBookings } from "@/services/apiBookings";
import { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";
import { getFilterFromUrl } from "@/utils/helper";
import type { TBooking, TBookingQuery } from "@/types/booking";

// 1. Query 配置
export const bookingsQuery = (
  filter: TBookingQuery,
  method: "gte" | "lte" | "eq",
  sortBy: string,
  direction: string,
  page: number,
) => ({
  queryKey: ["bookings", filter, method, sortBy, direction, page],
  // 当 React Query 检测到 Query Key 变化时，会自动向旧的 queryFn 传递一个取消信号。
  // 将这个信号传递给 Supabase，让其终止网络请求
  // 这可以在用户在上一个请求未结束时就发起下一个请求时终止上一个请求，节约资源。
  queryFn: async ({ signal }: { signal?: AbortSignal }) => {
    const { data, count } = await getBookings(
      filter,
      method,
      sortBy,
      direction,
      page,
      signal,
    );
    return { data: data as unknown as TBooking[], count };
  },
  // 针对高频查询场景，缩短垃圾回收时间以释放内存
  gcTime: 60 * 1000,
});

// 2. Loader 使用 ensureQueryData 预加载数据
export const bookingsLoader =
  (queryClient: QueryClient, method: "gte" | "lte" | "eq") =>
  async ({ request }: LoaderFunctionArgs) => {
    // 路由定义时不需要显式传参，React Router 会自动调用返回的函数并传入 { request }
    const url = new URL(request.url);
    const filters = getFilterFromUrl(url.searchParams);
    const sortByRaw = url.searchParams.get("sortBy") || "startDate-desc";
    const [sortBy, direction] = sortByRaw.split("-");
    const page = !url.searchParams.get("page")
      ? 1
      : Number(url.searchParams.get("page"));

    return await queryClient.ensureQueryData(
      bookingsQuery(filters, method, sortBy, direction, page),
    );
  };
