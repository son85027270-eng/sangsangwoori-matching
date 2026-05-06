import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateScore } from "@/lib/matching";
import type { Senior, Job } from "@/lib/supabase";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// POST /api/match  body: { seniorId: string }
// 해당 시니어와 모든 일자리를 비교해 점수 > 0인 매칭을 upsert
export async function POST(req: NextRequest) {
  const { seniorId } = await req.json();
  if (!seniorId) {
    return NextResponse.json({ error: "seniorId required" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: senior, error: seniorErr } = await supabase
    .from("seniors")
    .select("*")
    .eq("id", seniorId)
    .single();

  if (seniorErr || !senior) {
    return NextResponse.json({ error: "senior not found" }, { status: 404 });
  }

  const { data: jobs, error: jobsErr } = await supabase
    .from("jobs")
    .select("*");

  if (jobsErr) {
    return NextResponse.json({ error: jobsErr.message }, { status: 500 });
  }

  const rows = (jobs as Job[])
    .map((job) => ({
      senior_id: (senior as Senior).id,
      job_id: job.id,
      score: calculateScore(senior as Senior, job),
      status: "pending",
    }))
    .filter((r) => r.score > 0);

  if (rows.length === 0) {
    return NextResponse.json({ matched: 0 });
  }

  const { error: upsertErr } = await supabase
    .from("matches")
    .upsert(rows, { onConflict: "senior_id,job_id" });

  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({ matched: rows.length });
}
