import { PAGE_SIZE } from "@/utils/constants";
import { getToday } from "@/utils/helper";
import supabase from "./supabase";
import type {
  TBookingRow,
  TBooking,
  TBookingDetail,
  TStayActivity,
  TBookingQuery,
  TUpdateBooking,
  TBookingsAfterDate,
  TStaysAfterDate,
} from "@/types/booking";

export async function getBookings(
  filter: TBookingQuery,
  method: "gte" | "lte" | "eq",
  sortBy: string,
  direction: string,
  page: number,
  signal?: AbortSignal,
): Promise<{ data: TBooking[]; count: number | null }> {
  let query = supabase
    .from("bookings")
    .select(
      "id,created_at,startDate,endDate,numNights,numGuests,totalPrice,status,cabins(name),guests(fullName,email)",
      { count: "exact" },
    );
  if (signal) {
    query = query.abortSignal(signal);
  }
  if (filter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = (query as any)[method](filter.field, filter.value);
  }
  query.order(sortBy, { ascending: direction === "asc" });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) {
    // 请求被取消时，抛出的 AbortError 会直接冒泡给 React Query处理
    // 所以此处需要单独处理，避免取消请求的错误被当成常规错误抛出引起错误弹窗
    if (signal?.aborted) {
      const abortError = new Error("请求被取消");
      abortError.name = "AbortError";
      throw abortError;
    }
    throw new Error("获取预订列表失败");
  }

  return { data: data as unknown as TBooking[], count };
}

export async function getBooking(id: number): Promise<TBookingDetail> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("预订不存在");
  }

  return data as unknown as TBookingDetail;
}

export async function updateBooking(
  id: number,
  obj: TUpdateBooking,
): Promise<TBookingRow> {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("预订更新失败");
  }
  return data as TBookingRow;
}

export async function deleteBooking(bookingId: number): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("预订删除失败");
  }
}

export async function getBookingsAfterDate(
  date: string,
): Promise<TBookingsAfterDate[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("获取预订列表失败");
  }

  return data;
}

export async function getStaysAfterDate(
  date: string,
): Promise<TStaysAfterDate[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("获取住宿列表失败");
  }

  return data;
}

export async function getStaysTodayActivity(): Promise<TStayActivity[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday({
        end: false,
      })}),and(status.eq.checked-in,endDate.eq.${getToday({ end: false })})`,
    )
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("获取住宿活动列表失败");
  }
  return data as unknown as TStayActivity[];
}
