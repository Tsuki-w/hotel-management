import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import styled from "styled-components";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userQuery } from "@/loader/userLoader";

const FullPage = styled.div`
  height: 100dvh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

type IProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: IProps) {
  const navigate = useNavigate();
  //1. 加载已验证用户
  const { data: user, isPending } = useQuery(userQuery());
  const isAuthenticated = user?.role === "authenticated";

  //2. 如果没有已验证用户，重定向到登录页面
  useEffect(
    function () {
      if (!isAuthenticated && !isPending) navigate("/login");
    },
    [isAuthenticated, isPending, navigate],
  );

  //3. 加载时显示旋转加载器
  if (isPending)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //4. 如果有用户，渲染应用
  if (isAuthenticated) return children;
  return null;
}

export default ProtectedRoute;
