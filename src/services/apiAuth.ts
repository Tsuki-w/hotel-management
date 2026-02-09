import supabase from "@/services/supabase";
import { supabaseUrl } from "@/services/supabase";
import type { User, Session } from "@supabase/supabase-js";
import type { TSignup, TUpdateUser } from "@/types/auth";

export async function Signup({
  fullName,
  email,
  password,
}: TSignup): Promise<{ user: User | null; session: Session | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error("注册失败");

  return data;
}

export const Login = async (
  email: string,
  password: string,
): Promise<{ user: User; session: Session }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error("登录失败");
  }
  return data as { user: User; session: Session };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return null;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error("获取用户信息失败");
  }
  return data?.user;
};

export async function Logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("注销失败");
}

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
}: TUpdateUser): Promise<{ user: User }> {
  // 更新密码和姓名
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const { data, error } = await supabase.auth.updateUser(updateData || {});
  if (error) throw new Error("用户账户更新失败");
  if (!avatar) return data as { user: User };

  // 上传头像
  const fileName = `avatar-${data?.user?.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error("头像上传失败");
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });
  if (error2) throw new Error("用户账户更新失败");
  return updatedUser as { user: User };
}
