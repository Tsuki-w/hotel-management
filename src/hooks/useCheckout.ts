import { useMutation } from "@tanstack/react-query";
import { updateBooking } from "@/services/apiBookings";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

type ICheckout = {
  id: number;
};
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const { mutate: checkout, isPending: isCheckingout } = useMutation({
    mutationFn: ({ id }: ICheckout) =>
      updateBooking(id, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`预订 #${data.id} 退房成功`);
      queryClient.invalidateQueries({ queryKey: ["todayActivity"] });
      queryClient.invalidateQueries({ queryKey: ["stayAfterDate"] });
      queryClient.invalidateQueries({ queryKey: ["bookingsAfterDate"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", data.id] });
    },
    onError: () => {
      toast.error(`预订无法办理退房`);
    },
  });
  return { checkout, isCheckingout };
};
