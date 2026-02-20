import Form from "@/ui/Form";
import FormRow from "@/ui/FormRow";
import Input from "@/ui/Input";
import { useSettings } from "@/hooks/useSettings";
import Spinner from "@/ui/Spinner";
import { useUpdateSetting } from "@/hooks/useEditSettings";
import Button from "@/ui/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { TUpdateSetting } from "@/types/setting";

function UpdateSettingsForm() {
  const { data: settings } = useSettings();
  const { updateSettings, isPending } = useUpdateSetting();
  const { register, handleSubmit, formState, getValues } = useForm();
  const { errors } = formState;

  if (!settings) return <Spinner />;

  const handleUpdate: SubmitHandler<Omit<TUpdateSetting, "id">> = (data) => {
    if (!settings) return;
    updateSettings({ ...data, id: settings[0].id });
  };
  const setting = settings[0];
  const { minBookingLength, maxBookingLength, breakfastPrice } = setting;

  return (
    <Form onSubmit={handleSubmit(handleUpdate)}>
      <FormRow
        htmlFor="min-nights"
        label="最少预订天数"
        error={errors?.minBookingLength?.message as string}
      >
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isPending}
          {...register("minBookingLength", {
            required: "最少预订天数不能为空",
            validate: (value) => {
              if (Number(value) > Number(getValues().maxBookingLength))
                return "最少预订天数不能大于最大预订天数";
            },
          })}
        />
      </FormRow>

      <FormRow
        htmlFor="max-nights"
        label="最大预订天数"
        error={errors?.maxBookingLength?.message as string}
      >
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isPending}
          {...register("maxBookingLength", {
            required: "最大预订天数不能为空",
          })}
        />
      </FormRow>

      <FormRow
        htmlFor="breakfast-price"
        label="早餐价格"
        error={errors?.breakfastPrice?.message as string}
      >
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isPending}
          step="any"
          {...register("breakfastPrice", {
            required: "早餐价格不能为空",
          })}
        />
      </FormRow>
      <FormRow>
        <Button variation="primary" size="medium" disabled={isPending}>
          {!isPending ? "更新设置" : "更新中"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
