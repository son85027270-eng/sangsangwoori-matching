import { createClient } from '@supabase/supabase-js';

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function resetDb() {
  const db = getSupabase();
  // FK 순서: matches → seniors, jobs
  await db.from('matches').delete().not('id', 'is', null);
  await db.from('seniors').delete().not('id', 'is', null);
  await db.from('jobs').delete().not('id', 'is', null);
}

export async function seedJob(opts: {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}) {
  const db = getSupabase();
  const { data, error } = await db.from('jobs').insert(opts).select().single();
  if (error) throw new Error(`seedJob 실패: ${error.message}`);
  return data;
}
