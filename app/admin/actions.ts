"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function assignMatch(matchId: string) {
  const supabase = getSupabase();
  await supabase
    .from("matches")
    .update({ status: "assigned" })
    .eq("id", matchId);
  revalidatePath("/admin");
  revalidatePath("/recommendations");
}
