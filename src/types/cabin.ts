export type TCabin = {
  id: number;
  created_at: Date;
  name: string | null;
  maxCapacity: number | null;
  regularPrice: number | null;
  discount: number | null;
  description: string | null;
  image: string | null;
};

export type TCreateCabinArgs = Omit<TCabin, "id" | "created_at" | "image"> & {
  image: File | string;
};
