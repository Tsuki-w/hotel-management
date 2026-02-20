import { updateSetting } from "@/services/apiSetting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  const { isPending, mutate: updateSettings } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("设置更新成功");
    },
    onError: () => {
      toast.error("设置更新失败");
    },
  });
  return {
    isPending,
    updateSettings,
  };
};
