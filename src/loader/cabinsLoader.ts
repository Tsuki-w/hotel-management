import { getCabins } from "@/services/apiCabins";
import { type TCabin } from "@/types/cabin";
import { QueryClient } from "@tanstack/react-query";

// 1. Query 配置
export const cabinsQuery = () => ({
  queryKey: ["cabins"],
  queryFn: () => getCabins(),
});

// 2. Loader 使用 ensureQueryData 预加载数据
export const cabinsLoader =
  (queryClient: QueryClient) => async (): Promise<TCabin[]> => {
    return await queryClient.ensureQueryData(cabinsQuery());
  };
