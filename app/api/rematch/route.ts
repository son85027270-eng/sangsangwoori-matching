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

// POST /api/rematch
// body: { jobId?: string }
//   jobId 있음 → 해당 일자리와 전체 시니어 재매칭
//   jobId 없음 → 전체 시니어 × 전체 일자리 재계산
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { jobId } = body as { jobId?: string };

  const supabase = getSupabase();

  const { data: seniors, error: sErr } = await supabase
    .from("seniors")
    .select("*");
  if (sErr || !seniors) {
    return NextResponse.json({ error: sErr?.message }, { status: 500 });
  }

  let jobs: Job[];
  if (jobId) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "job not found" }, { status: 404 });
    }
    jobs = [data as Job];
  } else {
    const { data, error } = await supabase.from("jobs").select("*");
    if (error || !data) {
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }
    jobs = data as Job[];
  }

  const rows = (seniors as Senior[]).flatMap((senior) =>
    jobs
      .map((job) => ({
        senior_id: senior.id,
        job_id: job.id,
        score: calculateScore(senior, job),
        status: "pending",
      }))
      .filter((r) => r.score > 0)
  );

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
