import SignupForm from "@/features/auth/SignupForm";

import Heading from "@/ui/Heading";

function NewUsers() {
  return (
    <>
      <Heading as="h1">创建新管理账户</Heading>
      <SignupForm />
    </>
  );
}

export default NewUsers;
