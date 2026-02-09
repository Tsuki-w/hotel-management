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
  queryFn: async () => {
    const { data, count } = await getBookings(
      filter,
      method,
      sortBy,
      direction,
      page,
    );
    return { data: data as unknown as TBooking[], count };
  },
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
