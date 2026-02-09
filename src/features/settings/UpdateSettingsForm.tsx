import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { useSettings } from "@/hooks/useSettings";
import { useUpdateSetting } from "@/hooks/useEditSettings";
import Spinner from "@/ui/Spinner";

function UpdateSettingsForm() {
  const { data: settings } = useSettings();
  const { isPending, mutate } = useUpdateSetting();
  if (!settings) return <Spinner />;
  const handleUpdate = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    mutate({
      [field]: Number(e.target.value),
      id: settings[0].id,
    });
  };
  const setting = settings[0];
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = setting;

  return (
    <Form>
      <FormRow htmlFor="min-nights" label="最少预订天数">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isPending}
          onBlur={(e) => handleUpdate(e, "minBookingLength")}
        />
      </FormRow>

      <FormRow htmlFor="max-nights" label="最多预订天数">
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isPending}
          onBlur={(e) => handleUpdate(e, "maxBookingLength")}
        />
      </FormRow>

      <FormRow htmlFor="max-guests" label="最大入住人数">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isPending}
          onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
        />
      </FormRow>

      <FormRow htmlFor="breakfast-price" label="早餐价格">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isPending}
          onBlur={(e) => handleUpdate(e, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
