import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-blue-700 mb-4">상상우리</h1>
      <p className="text-2xl text-gray-600 mb-16">시니어와 일자리를 자동으로 연결합니다</p>

      <div className="flex flex-col items-center gap-5">
        <Link
          href="/register"
          className="w-80 py-5 text-2xl font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg"
        >
          내 프로필 등록하기
        </Link>
        <Link
          href="/recommendations"
          className="w-80 py-5 text-2xl font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 transition-colors shadow-lg"
        >
          추천 일자리 보기
        </Link>
        <Link
          href="/admin"
          className="w-80 py-5 text-2xl font-bold text-white bg-gray-600 rounded-2xl hover:bg-gray-700 transition-colors shadow-lg"
        >
          담당자 대시보드
        </Link>
      </div>
    </div>
  );
}
