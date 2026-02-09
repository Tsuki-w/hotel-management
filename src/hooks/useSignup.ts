import { Signup } from "@/services/apiAuth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSignup = () => {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: Signup,
    onSuccess: () => {
      toast.success("注册成功");
    },
    onError: () => {
      toast.error("注册失败");
    },
  });
  return {
    signup,
    isPending,
  };
};
