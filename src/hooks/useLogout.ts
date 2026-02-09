import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Logout } from "@/services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      toast.success("注销成功");
      navigate("/login", { replace: true });
      queryClient.removeQueries();
    },
    onError: () => {
      toast.error("注销失败");
    },
  });
  return {
    logout,
    isPending,
  };
};
