import { getBooking } from "@/services/apiBookings";
import { QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs } from "react-router-dom";

// 1. Query 配置
export const bookingQuery = (id: number) => ({
  queryKey: ["booking", id],
  queryFn: async () => {
    const data = await getBooking(id);
    return data;
  },
});

// 2. Loader 使用 ensureQueryData 预加载数据
export const bookingLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    // 路由定义时不需要显式传参，React Router 会自动调用返回的函数并传入 { request }
    const url = new URL(request.url);
    const id = Number(url.pathname.split("/")[2]);
    return await queryClient.ensureQueryData(bookingQuery(id));
  };
