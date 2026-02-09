import Input from "@/ui/Input";
import Form from "@/ui/Form";
import Button from "@/ui/Button";
import FileInput from "@/ui/FileInput";
import Textarea from "@/ui/Textarea";
import FormRow from "@/ui/FormRow";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { TCabin } from "@/types/cabin";
import { useCreateCabin } from "@/hooks/useCreateCabin";

type TFormValues = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: FileList;
};

type IProps = {
  cabinToEdit?: TCabin;
  onCloseModal?: () => void;
};

function CreateCabinForm({ cabinToEdit = {} as TCabin, onCloseModal }: IProps) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, getValues, formState, reset } =
    useForm<TFormValues>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValues: isEditSession ? (editValues as any) : {},
    });
  const { errors } = formState;
  const { isPending, mutate } = useCreateCabin();
  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    const imageFile =
      typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession) {
      mutate(
        { newCabinData: { ...data, image: imageFile }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      mutate(
        { newCabinData: { ...data, image: imageFile } },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    }
  };
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="房间名称" error={errors?.name?.message as string}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "房间名称为必填项",
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow label="最大人数" error={errors?.maxCapacity?.message as string}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "最大人数为必填项",
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow label="常规价格" error={errors?.regularPrice?.message as string}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "常规价格为必填项",
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow label="折扣" error={errors?.discount?.message as string}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "折扣为必填项",
            validate: (value) =>
              value <= Number(getValues().regularPrice) ||
              "折扣必须小于常规价格",
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow label="网站描述" error={errors?.description?.message as string}>
        <Textarea
          id="description"
          {...register("description", {
            required: "描述为必填项",
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow label="房间照片" error={errors?.image?.message as string}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "房间照片为必填项",
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow>
        <Button variation="primary" size="medium" disabled={isPending}>
          {isEditSession ? "更新房间" : "创建房间"}
        </Button>
        <Button
          variation="secondary"
          size="medium"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          取消
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
