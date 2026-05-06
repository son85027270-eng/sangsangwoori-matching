const COLUMNS = [
  {
    id: "unmatched",
    label: "미매칭",
    headerColor: "bg-red-600",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
  },
  {
    id: "pending",
    label: "매칭 대기",
    headerColor: "bg-yellow-500",
    borderColor: "border-yellow-200",
    bgColor: "bg-yellow-50",
  },
  {
    id: "assigned",
    label: "배정 완료",
    headerColor: "bg-green-600",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-600 mb-10">
        시니어 매칭 현황을 한눈에 확인합니다
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className={`border-2 ${col.borderColor} ${col.bgColor} rounded-2xl overflow-hidden`}
          >
            <div className={`${col.headerColor} px-6 py-4`}>
              <h2 className="text-2xl font-bold text-white">{col.label}</h2>
              <span className="text-white text-lg opacity-80">— 건</span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <p className="text-center text-gray-400 text-base pt-2">
                데이터 연동 예정
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">전체 통계</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "등록된 시니어", value: "—" },
            { label: "등록된 일자리", value: "—" },
            { label: "매칭 성공률", value: "— %" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-lg text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
