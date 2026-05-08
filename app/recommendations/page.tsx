import { createClient } from "@supabase/supabase-js";
import type { MatchWithRelations } from "@/lib/supabase";

async function getMatches(): Promise<MatchWithRelations[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("matches")
    .select("*, seniors(*), jobs(*)")
    .order("score", { ascending: false });

  if (error || !data) return [];
  return data as MatchWithRelations[];
}

export default async function RecommendationsPage() {
  const matches = await getMatches();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리</h1>
      <p className="text-xl text-gray-600 mb-10">
        매칭 점수가 높은 순서로 보여드립니다
      </p>

      {matches.length === 0 ? (
        <div className="text-center py-20 text-2xl text-gray-400">
          현재 매칭되는 일자리가 없습니다.
          <br />
          <span className="text-lg mt-2 block">
            먼저{" "}
            <a href="/register" className="text-blue-600 underline">
              프로필을 등록
            </a>
            해 주세요.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {matches.map((match, idx) => (
            <div
              key={match.id}
              className="border-2 border-gray-200 rounded-2xl p-6 flex items-center justify-between bg-white shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-800">
                    {match.jobs.title}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      match.status === "assigned"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {match.status === "assigned" ? "배정 완료" : "매칭 대기"}
                  </span>
                </div>
                <div className="text-lg text-gray-600">
                  지역: {match.jobs.region} | 직종: {match.jobs.job_type}
                </div>
                <div className="text-lg text-gray-600">
                  필요 경력: {match.jobs.required_career}년 이상
                </div>
                <div className="text-base text-gray-500 mt-1">
                  신청자: {match.seniors.name} ({match.seniors.region})
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 min-w-28">
                <span
                  className={`text-5xl font-bold ${
                    match.score >= 80
                      ? "text-blue-600"
                      : match.score >= 50
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {match.score}
                </span>
                <span className="text-base text-gray-500">매칭 점수</span>
                <span className="text-sm text-gray-400">#{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
