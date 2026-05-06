const PLACEHOLDER_CARDS = [
  { rank: 1, score: 95 },
  { rank: 2, score: 87 },
  { rank: 3, score: 72 },
];

export default function RecommendationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리</h1>
      <p className="text-xl text-gray-600 mb-10">
        나에게 맞는 일자리를 매칭 점수 순으로 보여드립니다
      </p>

      <div className="flex flex-col gap-6">
        {PLACEHOLDER_CARDS.map((item) => (
          <div
            key={item.rank}
            className="border-2 border-gray-200 rounded-2xl p-6 flex items-center justify-between bg-gray-50"
          >
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-bold text-gray-400">
                #{item.rank} 일자리
              </span>
              <span className="text-lg text-gray-500">직종 / 지역 / 조건 표시 예정</span>
              <span className="text-base text-gray-400">
                담당자: — | 필요 경력: — 년
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-24">
              <span className="text-5xl font-bold text-blue-600">{item.score}</span>
              <span className="text-base text-gray-500">매칭 점수</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-xl text-gray-400">
        ※ 실제 매칭 데이터는 다음 단계에서 연동됩니다
      </p>
    </div>
  );
}
