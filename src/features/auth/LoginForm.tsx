import { useState } from "react";
import Button from "@/ui/Button";
import Form from "@/ui/Form";
import Input from "@/ui/Input";
import FormRowVertical from "@/ui/ForwRowVertical";
import { useLogin } from "@/hooks/useLogin";
import SpinnerMini from "@/ui/SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState<string>("Tsuki@example.com");
  const [password, setPassword] = useState<string>("123456");
  const { login, isPending } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="邮箱地址">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      <FormRowVertical label="密码">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isPending}>
          {!isPending ? "登录" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
