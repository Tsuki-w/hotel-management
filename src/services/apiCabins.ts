import supabase, { supabaseUrl } from "./supabase";
import type { TCabin, TCreateCabinArgs } from "@/types/cabin";

export const getCabins = async (): Promise<TCabin[]> => {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    throw new Error("获取房间列表失败");
  }
  return data;
};

export const deleteCabin = async (id: number): Promise<void> => {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    throw new Error("删除房间失败");
  }
};

export const createEditCabin = async (
  newCabin: TCreateCabinArgs,
  id?: number,
): Promise<TCabin> => {
  // 根据是否image是string类型还是File类型区分用户是保留久图片还是上传新图片
  const hasImagePath = Boolean(
    typeof newCabin.image === "string" &&
    newCabin.image.startsWith(supabaseUrl),
  );
  const imageName =
    `${Math.random()}` +
    "-" +
    `${(newCabin.image as File).name}`.replaceAll("/", "");
  // 如果是旧图片直接使用旧路径，否则上传新图片
  const imagePath = hasImagePath
    ? (newCabin.image as string)
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from("cabins");
  if (id) {
    query = query.update([{ ...newCabin, image: imagePath }]).eq("id", id);
  } else {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }
  const { data, error } = await query.select().single();
  if (error) {
    throw new Error("创建房间失败");
  }
  // 如果是旧图片直接返回数据
  if (hasImagePath) {
    return data;
  }
  const { error: uploadError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName as string, newCabin.image!);
  if (uploadError) {
    if (!id) await supabase.from("cabins").delete().eq("id", data.id);
    throw new Error("上传房间图片失败");
  }
  return data;
};
