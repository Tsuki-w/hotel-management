import Heading from "@/ui/Heading";
import Row from "@/ui/Row";
import BookingTable from "@/features/bookings/BookingTable";
import BookingTableOperations from "@/features/bookings/BookingTableOperations";

// 展示所有预定
const Booking = () => {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">所有预订</Heading>
        <BookingTableOperations />
      </Row>
      <BookingTable />
    </>
  );
};

export default Booking;
