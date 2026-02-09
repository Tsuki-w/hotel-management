import UpdateUserDataForm from "@/features/auth/UpdateUserDataForm";
import Heading from "@/ui/Heading";
import Row from "@/ui/Row";

function Account() {
  return (
    <>
      <Heading as="h1">更新您的账户</Heading>

      <Row type="vertical">
        <Heading as="h2">更新用户资料</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row type="vertical">
        <Heading as="h2">更新密码</Heading>
        {/* <UpdatePasswordForm /> */}
      </Row>
    </>
  );
}

export default Account;
