import styled from "styled-components";
import Row from "@/ui/Row";
import Heading from "@/ui/Heading";
import Tag from "@/ui/Tag";
import Button from "@/ui/Button";
import Spinner from "@/ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@/ui/Modal";
import ConfirmDelete from "@/ui/ConfirmDelete";
import ButtonGroup from "@/ui/ButtonGroup";
import ButtonText from "@/ui/ButtonText";
import { useMoveBack } from "@/hooks/useMoveBack";
import { useQuery } from "@tanstack/react-query";
import { bookingQuery } from "@/loader/bookingItemLoader";
import BookingDataBox from "@/features/bookings/BookingDataBox";
import { useCheckout } from "@/hooks/useCheckout";
import { useDeleteBooking } from "@/hooks/useDeleteBooking";
import Empty from "@/ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const moveBack = useMoveBack();
  const { data: booking, isPending } = useQuery(bookingQuery(Number(id)));
  const { checkout, isCheckingout } = useCheckout();
  const { deleteBookingItem, isDeleting } = useDeleteBooking();
  if (isPending || isCheckingout || isDeleting) {
    return <Spinner />;
  }

  if (!booking) return <Empty resourceName="预定" />;

  const statusToTagName = {
    unconfirmed: "red",
    "checked-in": "green",
    "checked-out": "silver",
    confirmed: "blue",
  };
  const statusToZh = {
    unconfirmed: "未确认",
    "checked-in": "已入住",
    "checked-out": "已退房",
    confirmed: "已确认",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">订单 #{id}</Heading>
          <Tag
            type={
              statusToTagName[booking?.status as keyof typeof statusToTagName]
            }
          >
            {statusToZh[booking?.status as keyof typeof statusToZh]}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; 返回</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {booking?.status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${id}`)}>办理入住</Button>
        )}

        {booking?.status === "checked-in" && (
          <Button
            onClick={() => checkout({ id: Number(id) })}
            disabled={isCheckingout}
          >
            退房
          </Button>
        )}

        {booking?.status === "checked-out" && (
          <Button
            onClick={() => deleteBookingItem(Number(id))}
            disabled={isDeleting}
          >
            删除
          </Button>
        )}
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">删除预订</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="预订"
              disabled={isDeleting}
              onConfirm={() => {
                deleteBookingItem(Number(id));
              }}
            />
          </Modal.Window>
        </Modal>
        <Button variation="secondary" onClick={moveBack}>
          返回
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
