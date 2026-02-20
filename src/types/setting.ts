export type TSettings = {
  id: number;
  created_at: string;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
};

export type TUpdateSetting = Partial<
  Omit<TSettings, "created_at" | "id" | "maxGuestsPerBooking">
> & {
  id: number;
};
