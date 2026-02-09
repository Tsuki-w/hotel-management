import styled from "styled-components";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/helper";
import Menus from "@/ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import type { TBooking } from "@/types/booking";
import { TableRow } from "@/ui/Table";
import Tag from "@/ui/Tag";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "@/hooks/useCheckout";
import { useDeleteBooking } from "@/hooks/useDeleteBooking";
import Spinner from "@/ui/Spinner";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

type IProps = {
  booking: TBooking;
};

function BookingRow({
  booking: {
    id,
    startDate,
    endDate,
    totalPrice,
    status,
    cabins: { name: cabinName },
    guests: { fullName: guestName, email },
  },
}: IProps) {
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
  const navigate = useNavigate();
  const { checkout, isCheckingout } = useCheckout();
  const { deleteBookingItem, isDeleting } = useDeleteBooking();
  if (isCheckingout || isDeleting) return <Spinner />;

  return (
    <TableRow>
      <Cabin>{cabinName}</Cabin>
      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>{guestName}</span>
        <span>
          {format(new Date(startDate), "yyyy年MM月dd日")} &mdash;{" "}
          {format(new Date(endDate), "yyyy年MM月dd日")}
        </span>
      </Stacked>
      <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
        {statusToZh[status as keyof typeof statusToZh]}
      </Tag>
      <Amount>{formatCurrency(totalPrice)}</Amount>
      <Menus.Item>
        <Menus.Toggle id={id} />
        <Menus.List id={id}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/bookings/${id}`)}
          >
            查看详情
          </Menus.Button>
          {status === "unconfirmed" && (
            <Menus.Button
              icon={<HiArrowDownOnSquare />}
              onClick={() => navigate(`/checkin/${id}`)}
            >
              办理入住
            </Menus.Button>
          )}
          {status === "checked-in" && (
            <Menus.Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => {
                checkout({ id });
              }}
            >
              退房
            </Menus.Button>
          )}
          {status === "checked-out" && (
            <Menus.Button
              icon={<HiTrash />}
              onClick={() => {
                deleteBookingItem(id);
              }}
            >
              删除
            </Menus.Button>
          )}
        </Menus.List>
      </Menus.Item>
    </TableRow>
  );
}

export default BookingRow;
