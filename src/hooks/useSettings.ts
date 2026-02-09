import { settingsQuery } from "@/loader/settingsLoader";
import { useQuery } from "@tanstack/react-query";

export function useSettings() {
  const { data, error, isPending } = useQuery(settingsQuery());
  return {
    data,
    error,
    isPending,
  };
}
