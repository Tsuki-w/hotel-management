import supabase from "./supabase";
import type { TSettings, TUpdateSetting } from "@/types/setting";

export async function getSettings(): Promise<TSettings[]> {
  const { data, error } = await supabase.from("settings").select("*");

  if (error) {
    console.error(error);
    throw new Error("设置加载失败");
  }
  return data;
}

export async function updateSetting(
  newSetting: TUpdateSetting,
): Promise<TSettings> {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    .eq("id", newSetting.id)
    .single();

  if (error) {
    throw new Error("更新失败");
  }
  return data;
}
