import { useForm } from "react-hook-form";
import { useSignup } from "@/hooks/useSignup";
import Button from "@/ui/Button";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";

type TFormInput = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

function SignupForm() {
  const { signup, isPending } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } =
    useForm<TFormInput>();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }: TFormInput) {
    signup(
      { fullName, email, password },
      {
        onSettled: () => reset(),
      },
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="全名" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isPending}
          {...register("fullName", { required: "此字段为必填项" })}
        />
      </FormRow>

      <FormRow label="邮箱地址" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register("email", {
            required: "此字段为必填项",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "请提供有效的邮箱地址。",
            },
          })}
        />
      </FormRow>

      <FormRow label="密码 (至少8个字符)" error={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register("password", {
            required: "此字段为必填项",
            minLength: {
              value: 8,
              message: "密码至少需要8个字符",
            },
          })}
        />
      </FormRow>

      <FormRow label="确认密码" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register("passwordConfirm", {
            required: "此字段为必填项",
            validate: (value) =>
              value === getValues().password || "两次输入的密码不一致",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type 是一个 HTML 属性 */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isPending}
          onClick={() => reset()}
        >
          取消
        </Button>
        <Button disabled={isPending}>创建</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
