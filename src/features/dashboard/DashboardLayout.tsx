import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  bookingsAfterDateQuery,
  stayAfterDateQuery,
} from "@/loader/dashboardLoader";
import { cabinsQuery } from "@/loader/cabinsLoader";
import { useSearchParams } from "react-router-dom"; // 添加依赖
import { subDays } from "date-fns";
import Spinner from "@/ui/Spinner";
import Stats from "@/features/dashboard/Stats";
import TodayActivity from "../check-in-out/TodayActivity";
import { lazy, Suspense } from "react";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 2.4rem;
`;

// 配合打包优化按需引入
const SalesChart = lazy(() => import("@/features/dashboard/SalesChart"));
const DurationChart = lazy(() => import("@/features/dashboard/DurationChart"));

function DashboardLayout() {
  const [searchParams] = useSearchParams();
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));
  const queryDate = subDays(
    new Date().setHours(0, 0, 0, 0),
    numDays,
  ).toISOString();
  const { data: bookings, isPending: isBookingsPending } = useQuery(
    bookingsAfterDateQuery(queryDate),
  );
  const { data: stays, isPending: isStaysPending } = useQuery(
    stayAfterDateQuery(queryDate),
  );
  const { data: cabins, isPending: isCabinsPending } = useQuery(cabinsQuery());
  const confirmStays = stays?.filter(
    (stay) => stay.status === "checked-in" || stay.status === "checked-out",
  );
  if (isBookingsPending || isStaysPending || isCabinsPending)
    return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings || []}
        confirmedStays={confirmStays || []}
        numDays={numDays}
        cabinCount={cabins?.length || 0}
      ></Stats>
      <TodayActivity />
      <Suspense fallback={<Spinner />}>
        <DurationChart confirmStays={confirmStays || []} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <SalesChart bookings={bookings || []} numDays={numDays} />
      </Suspense>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
