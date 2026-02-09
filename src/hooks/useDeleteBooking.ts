import { useMutation } from "@tanstack/react-query";
import { deleteBooking } from "@/services/apiBookings";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: deleteBookingItem, isPending: isDeleting } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayActivity"] });
      queryClient.invalidateQueries({ queryKey: ["stayAfterDate"] });
      queryClient.invalidateQueries({ queryKey: ["bookingsAfterDate"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate("/bookings");
      toast.success("预订成功删除");
    },
  });
  return {
    deleteBookingItem,
    isDeleting,
  };
};
