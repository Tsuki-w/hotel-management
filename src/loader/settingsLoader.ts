import { getSettings } from "@/services/apiSetting";
import type { TSettings } from "@/types/setting";
import type { QueryClient } from "@tanstack/react-query";

export const settingsQuery = () => ({
  queryKey: ["settings"],
  queryFn: () => getSettings(),
});

export const settingsLoader =
  (queryClient: QueryClient) => async (): Promise<TSettings[]> => {
    return await queryClient.ensureQueryData(settingsQuery());
  };
