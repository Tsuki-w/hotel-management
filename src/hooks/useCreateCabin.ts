import { createEditCabin } from "@/services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateCabin = () => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ newCabinData, id }: { newCabinData: any; id?: number }) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      toast.success("编辑房间成功");
    },
    onError: () => {
      toast.error("编辑房间失败");
    },
  });

  return {
    isPending,
    mutate,
  };
};
