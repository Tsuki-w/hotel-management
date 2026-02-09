import Menus from "@/ui/Menus";
import { Table, TableHeader } from "@/features/cabins/CabinTable";
import Empty from "@/ui/Empty";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsQuery } from "@/loader/bookingsLoader";
import Spinner from "@/ui/Spinner";
import BookingRow from "@/features/bookings/BookingRow";
import { useSearchParams } from "react-router-dom";
import Pagination from "@/ui/Pagination";
import { PAGE_SIZE } from "@/utils/constants";

// 用户预定数据表格
function BookingTable() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("status") || "all";
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [sortBy, direction] = sortByRaw.split("-");
  const page = Number(searchParams.get("page")) || 1;

  // 获取url中的过滤和排序参数
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : {
          field: "status",
          value: filterValue,
        };
  // 根据过滤条件获取数据
  const { data: bookings, isPending } = useQuery(
    bookingsQuery(filter, "eq", sortBy, direction, page),
  );
  // 提前预取后一页或前一页的数据
  if (page < Math.ceil(Number(bookings?.count || 0) / PAGE_SIZE)) {
    queryClient.prefetchQuery(
      bookingsQuery(filter, "eq", sortBy, direction, page + 1),
    );
  } else if (page > 1) {
    queryClient.prefetchQuery(
      bookingsQuery(filter, "eq", sortBy, direction, page - 1),
    );
  }
  if (isPending) return <Spinner />;
  if (!bookings?.data.length) {
    return <Empty resourceName="预订" />;
  }

  return (
    <>
      <Menus>
        <Table role="table">
          <TableHeader role="row">
            <div>房间</div>
            <div>客人</div>
            <div>日期</div>
            <div>状态</div>
            <div>金额</div>
            <div></div>
          </TableHeader>
          {bookings.data.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </Table>
      </Menus>
      <Pagination count={bookings.count || 0} />
    </>
  );
}

export default BookingTable;
