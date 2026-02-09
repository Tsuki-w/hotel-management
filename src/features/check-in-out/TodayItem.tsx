import styled from "styled-components";
import Tag from "@/ui/Tag";
import { Flag } from "@/ui/Flag";
import Button from "@/ui/Button";
import { Link } from "react-router-dom";
import CheckoutButton from "@/features/check-in-out/CheckoutButton";
import type { TStayActivity } from "@/types/booking";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

type IProps = {
  activity: TStayActivity;
};

function TodayItem({ activity }: IProps) {
  const { id, status, guests, numNights } = activity;

  return (
    <StyledTodayItem>
      {status === "unconfirmed" && <Tag type="green">即将入住</Tag>}
      {status === "checked-in" && <Tag type="blue">即将退房</Tag>}

      <Flag src={guests.countryFlag} alt={`${guests.nationality} 国旗`} />

      <Guest>{guests.fullName}</Guest>
      <div>{numNights} 晚</div>

      {status === "unconfirmed" && (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          办理入住
        </Button>
      )}

      {status === "checked-in" && <CheckoutButton bookingId={id} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
