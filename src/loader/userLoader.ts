import { getCurrentUser } from "@/services/apiAuth";
import type { QueryClient } from "@tanstack/react-query";

export const userQuery = () => ({
  queryKey: ["user"],
  queryFn: () => getCurrentUser(),
});

export const userLoader = (queryClient: QueryClient) => async () => {
  return await queryClient.ensureQueryData(userQuery());
};
