import UpdateSettingsForm from "@/features/settings/UpdateSettingsForm";
import Row from "@/ui/Row";
import Heading from "@/ui/Heading";

const Settings = () => {
  return (
    <Row type="vertical">
      <Heading as="h1">更新房间设置</Heading>
      <UpdateSettingsForm />
    </Row>
  );
};

export default Settings;
