import type { TCabin } from "@/types/cabin";

type TBookingStatus = "unconfirmed" | "checked-in" | "checked-out";

export type TBookingRow = {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: TBookingStatus;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: number;
  guestId: number;
};

export type TBooking = {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: TBookingStatus;
  cabins: { name: string | null };
  guests: { fullName: string | null; email: string | null };
};

export type TGuest = {
  id: number;
  created_at: string;
  fullName: string;
  email: string;
  nationalID: string;
  nationality: string;
  countryFlag: string;
};

export type TBookingDetail = TBookingRow & {
  cabins: TCabin;
  guests: TGuest;
};

export type TStayActivity = TBookingRow & {
  guests: Pick<TGuest, "fullName" | "nationality" | "countryFlag">;
};

export type TBookingQuery = {
  field: string;
  value: string;
} | null;

export type TUpdateBooking = {
  status: TBookingStatus;
  isPaid?: boolean;
};

export type TBookingsAfterDate = {
  created_at: string;
  extrasPrice: number;
  totalPrice: number;
};

export type TStaysAfterDate = TBookingRow & {
  guests: {
    fullName: string;
  };
};
