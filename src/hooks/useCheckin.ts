import { useMutation } from "@tanstack/react-query";
import { updateBooking } from "@/services/apiBookings";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type ICheckin = {
  id: number;
  breakfast?: {
    hasBreakfast: true;
    extrasPrice: number;
    totalPrice: number;
  };
};
export const useCheckin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkin, isPending: isChecking } = useMutation({
    mutationFn: ({ id, breakfast }: ICheckin) =>
      updateBooking(id, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: (data) => {
      // 指定失活的键，确保查询数据被刷新
      queryClient.invalidateQueries({ queryKey: ["todayActivity"] });
      queryClient.invalidateQueries({ queryKey: ["stayAfterDate"] });
      queryClient.invalidateQueries({ queryKey: ["bookingsAfterDate"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", data.id] });

      toast.success(`预订 #${data.id} 入住成功`);
      navigate("/");
    },
    onError: () => {
      toast.error(`预订无法办理入住`);
    },
  });
  return { checkin, isChecking };
};
