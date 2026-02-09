import { useState } from "react";
import Button from "@/ui/Button";
import FileInput from "@/ui/FileInput";
import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { userQuery } from "@/loader/userLoader";
import { useUpdateUser } from "@/hooks/useUpdateUser";

function UpdateUserDataForm() {
  const { data: user } = useQuery(userQuery());
  const {
    email,
    user_metadata: { fullName: currentFullName } = { fullName: "" },
  } = user || {};
  // console.log(user);

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState<string>(currentFullName || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;

    updateUser(
      { fullName, avatar: avatar as File },
      {
        onSuccess: () => {
          setAvatar(null);
          e.target.reset();
        },
      },
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="邮箱地址">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="全名">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="头像图片">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
              setAvatar(e.target.files[0]);
            }
          }}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          取消
        </Button>
        <Button disabled={isUpdating}>更新账户</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
