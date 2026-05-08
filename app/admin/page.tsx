import { createClient } from "@supabase/supabase-js";
import type { MatchWithRelations, Senior } from "@/lib/supabase";
import { assignMatch } from "./actions";
import JobManager from "./JobManager";
import RematchButton from "./RematchButton";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function getData() {
  const supabase = getSupabase();

  const [seniorsRes, matchedRes, pendingRes, assignedRes] = await Promise.all([
    supabase.from("seniors").select("*"),
    supabase.from("matches").select("senior_id"),
    supabase
      .from("matches")
      .select("*, seniors(*), jobs(*)")
      .eq("status", "pending")
      .order("score", { ascending: false }),
    supabase
      .from("matches")
      .select("*, seniors(*), jobs(*)")
      .eq("status", "assigned")
      .order("score", { ascending: false }),
  ]);

  const allSeniors: Senior[] = seniorsRes.data ?? [];
  const matchedIds = new Set((matchedRes.data ?? []).map((m) => m.senior_id));
  const unmatched = allSeniors.filter((s) => !matchedIds.has(s.id));
  const pending: MatchWithRelations[] = (pendingRes.data as MatchWithRelations[]) ?? [];
  const assigned: MatchWithRelations[] = (assignedRes.data as MatchWithRelations[]) ?? [];

  return { unmatched, pending, assigned, totalSeniors: allSeniors.length };
}

function WarningIcon() {
  return (
    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AssignButton({ matchId }: { matchId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await assignMatch(matchId);
      }}
    >
      <button
        type="submit"
        className="mt-3 w-full py-2 text-base font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
      >
        배정 완료 처리
      </button>
    </form>
  );
}

function SeniorCard({ senior }: { senior: Senior }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xl font-bold text-gray-800">{senior.name}</div>
      <div className="text-base text-gray-600 mt-1">
        {senior.region} | {senior.desired_job} | 경력 {senior.career_years}년
      </div>
      <a
        href={`/recommendations?senior_id=${senior.id}`}
        className="mt-3 block w-full py-2 text-base font-semibold text-center text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
      >
        상세 보기
      </a>
    </div>
  );
}

function MatchCard({ match, showAssign }: { match: MatchWithRelations; showAssign: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xl font-bold text-gray-800">{match.seniors.name}</span>
        <span className="text-2xl font-bold text-blue-600">{match.score}점</span>
      </div>
      <div className="text-base text-gray-600">
        {match.jobs.title} | {match.jobs.region}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {match.seniors.desired_job} → {match.jobs.job_type}
      </div>
      <a
        href={`/recommendations?senior_id=${match.senior_id}`}
        className="mt-3 block w-full py-2 text-base font-semibold text-center text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
      >
        상세 보기
      </a>
      {showAssign && <AssignButton matchId={match.id} />}
    </div>
  );
}

export default async function AdminPage() {
  const { unmatched, pending, assigned, totalSeniors } = await getData();

  const stats = [
    { label: "등록 시니어", value: totalSeniors, icon: <WarningIcon /> },
    { label: "매칭 성공", value: pending.length + assigned.length, icon: <ClockIcon /> },
    { label: "배정 완료", value: assigned.length, icon: <CheckIcon /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
          <p className="text-xl text-gray-600">매칭 현황을 확인하고 배정을 처리합니다</p>
        </div>
        <RematchButton />
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border-2 border-gray-200 rounded-2xl p-5 text-center">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="text-5xl font-bold text-blue-600 mb-1">{s.value}</div>
            <div className="text-lg text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 3컬럼 칸반 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 미매칭 */}
        <div className="border-2 border-red-200 bg-red-50 rounded-2xl overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">미매칭</h2>
            <span className="text-white text-lg opacity-80">{unmatched.length}명</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {unmatched.length === 0 ? (
              <p className="text-center text-gray-400 py-6">없음</p>
            ) : (
              unmatched.map((s) => <SeniorCard key={s.id} senior={s} />)
            )}
          </div>
        </div>

        {/* 매칭 대기 */}
        <div className="border-2 border-yellow-200 bg-yellow-50 rounded-2xl overflow-hidden">
          <div className="bg-yellow-500 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">매칭 대기</h2>
            <span className="text-white text-lg opacity-80">{pending.length}건</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {pending.length === 0 ? (
              <p className="text-center text-gray-400 py-6">없음</p>
            ) : (
              pending.map((m) => <MatchCard key={m.id} match={m} showAssign={true} />)
            )}
          </div>
        </div>

        {/* 배정 완료 */}
        <div className="border-2 border-green-200 bg-green-50 rounded-2xl overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">배정 완료</h2>
            <span className="text-white text-lg opacity-80">{assigned.length}건</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {assigned.length === 0 ? (
              <p className="text-center text-gray-400 py-6">없음</p>
            ) : (
              assigned.map((m) => <MatchCard key={m.id} match={m} showAssign={false} />)
            )}
          </div>
        </div>
      </div>

      {/* 일자리 관리 */}
      <JobManager />
    </div>
  );
}
