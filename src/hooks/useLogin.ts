import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Login } from "@/services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type TLogin = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: TLogin) => Login(email, password),
    onSuccess: (data) => {
      toast.success("登录成功");
      navigate("/dashboard");
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  return {
    login,
    isPending,
  };
};
