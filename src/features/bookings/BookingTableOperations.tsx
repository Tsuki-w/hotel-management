import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "@/ui/TableOperation";

// 操作预定数据的表格
function BookingTableOperations() {
  return (
    <TableOperations>
      {/* 通过useSearchParams动态设置查询参数 */}
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "全部" },
          { value: "checked-out", label: "已退房" },
          { value: "checked-in", label: "已入住" },
          { value: "unconfirmed", label: "未确认" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "按日期排序 (最近优先)" },
          { value: "startDate-asc", label: "按日期排序 (最早优先)" },
          {
            value: "totalPrice-desc",
            label: "按金额排序 (从高到低)",
          },
          { value: "totalPrice-asc", label: "按金额排序 (从低到高)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
