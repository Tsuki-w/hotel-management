import Button from "../../ui/Button";
import { useCheckout } from "@/hooks/useCheckout";

type IProps = {
  bookingId: number;
};

function CheckoutButton({ bookingId }: IProps) {
  const { checkout, isCheckingout } = useCheckout();

  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkout({ id: Number(bookingId) })}
      disabled={isCheckingout}
    >
      退房
    </Button>
  );
}

export default CheckoutButton;
