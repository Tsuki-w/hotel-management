import { formatDistance, parseISO, differenceInDays } from "date-fns";
import { zhCN } from "date-fns/locale";

// 同时处理 Date 对象和字符串（来自 Supabase）
export const subtractDates = (
  dateStr1: Date | string,
  dateStr2: Date | string,
) => differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr: Date | string) =>
  formatDistance(parseISO(String(dateStr)), new Date(), {
    addSuffix: true,
    locale: zhCN,
  });

// Supabase 需要 ISO 日期字符串，但由于毫秒或秒的变化，该字符串在每次渲染时都会不同，所以统一设置时间
export const getToday = function (options?: { end?: boolean }) {
  const today = new Date();
  if (options?.end)
    // 设置为一天的最后一秒
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value,
  );

export const getFilterFromUrl = (searchParams: URLSearchParams) => {
  return {
    field: searchParams.get("field") || "",
    value: searchParams.get("value") || "",
  };
};
