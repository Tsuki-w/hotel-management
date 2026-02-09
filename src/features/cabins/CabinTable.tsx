import { useQuery } from "@tanstack/react-query";
import { cabinsQuery } from "@/loader/cabinsLoader";
import { type TCabin } from "@/types/cabin";
import styled from "styled-components";
import Spinner from "@/ui/Spinner";
import CabinRow from "./CabinRow";
import Menus from "@/ui/Menus";
import { useSearchParams } from "react-router-dom";

export const Table = styled.div`
  width: 100%;
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function CabinTable() {
  const { data: cabins, isPending } = useQuery(cabinsQuery());
  const [searchParams] = useSearchParams();
  if (isPending) {
    return <Spinner />;
  }
  // 过滤
  const filterValue = searchParams.get("discount") || "all";
  let filteredCabins = [] as TCabin[];
  if (filterValue === "all") {
    filteredCabins = cabins || [];
  } else if (filterValue === "with-discount") {
    filteredCabins =
      cabins?.filter(
        (cabin) => cabin.discount !== null && cabin.discount > 0,
      ) || [];
  } else if (filterValue === "no-discount") {
    filteredCabins = cabins?.filter((cabin) => cabin.discount === 0) || [];
  }

  // 排序
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabin = filteredCabins.sort((a, b) => {
    const valueA = a[field as keyof TCabin];
    const valueB = b[field as keyof TCabin];
    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * modifier;
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * modifier;
    }
    return 0;
  });
  return (
    <Menus>
      <Table role="table">
        <TableHeader role="row">
          <div></div>
          <div>房间</div>
          <div>容量</div>
          <div>价格</div>
          <div>折扣</div>
          <div></div>
        </TableHeader>
        {sortedCabin?.map((cabin: TCabin) => (
          <CabinRow cabin={cabin} key={cabin.id}></CabinRow>
        ))}
      </Table>
    </Menus>
  );
}

export default CabinTable;
