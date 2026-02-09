import styled from "styled-components";
import BookingDataBox from "@/features/bookings/BookingDataBox";
import Row from "@/ui/Row";
import Heading from "@/ui/Heading";
import Checkbox from "@/ui/CheckBox";
import ButtonGroup from "@/ui/ButtonGroup";
import Button from "@/ui/Button";
import ButtonText from "@/ui/ButtonText";
import { useMoveBack } from "@/hooks/useMoveBack";
import { useCheckin } from "@/hooks/useCheckin";
import Spinner from "@/ui/Spinner";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { bookingQuery } from "@/loader/bookingItemLoader";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/helper";
import { useSettings } from "@/hooks/useSettings";

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const { id } = useParams();
  const { data: booking, isPending } = useQuery(bookingQuery(Number(id)));
  const [confirmPaid, setConfirmPaid] = useState<boolean>(true);
  const [addBreakfast, setAddBreakFast] = useState<boolean>(false);
  const moveBack = useMoveBack();
  const { checkin, isChecking } = useCheckin();
  const { data: settings } = useSettings();

  if (isPending || isChecking || !booking) return <Spinner />;

  const { guests, totalPrice, numGuests, hasBreakfast, numNights } = booking;
  const setting = settings?.find((item) => item.id === Number(id));

  const breakfastPrice =
    setting?.breakfastPrice || 0 * numNights * numGuests || 0;

  function handleCheckin() {
    if (!confirmPaid) return;
    if (addBreakfast) {
      checkin({
        id: Number(id),
        breakfast: {
          hasBreakfast: true,
          extrasPrice: breakfastPrice,
          totalPrice: totalPrice + breakfastPrice,
        },
      });
    } else {
      checkin({
        id: Number(id),
      });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">入住 #{id}</Heading>
        <ButtonText onClick={moveBack}>&larr; 返回</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakFast(!addBreakfast);
              setConfirmPaid(false);
            }}
            id="confirm"
            disabled={addBreakfast || isChecking}
          >
            是否添加早餐？费用 {breakfastPrice}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid(!confirmPaid)}
          id="confirm"
          disabled={confirmPaid || isChecking}
        >
          确认 {guests?.fullName} 已支付总金额{" "}
          {formatCurrency(totalPrice + (addBreakfast ? breakfastPrice : 0))}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid}>
          办理入住 订单 #{id}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          返回
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
