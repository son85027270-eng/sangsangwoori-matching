export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-10">
        정보를 입력하시면 맞는 일자리를 찾아드립니다
      </p>

      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-xl font-semibold text-gray-800">이름</label>
          <input
            type="text"
            placeholder="홍길동"
            disabled
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl font-semibold text-gray-800">지역</label>
          <input
            type="text"
            placeholder="예: 서울 강남구"
            disabled
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl font-semibold text-gray-800">희망 직종</label>
          <input
            type="text"
            placeholder="예: 경비, 청소, 요리보조"
            disabled
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl font-semibold text-gray-800">경력 (년)</label>
          <input
            type="number"
            placeholder="예: 10"
            disabled
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled
          className="mt-4 py-5 text-2xl font-bold text-white bg-blue-600 rounded-2xl opacity-40 cursor-not-allowed"
        >
          등록하기 (다음 단계에서 구현)
        </button>
      </form>

      <p className="mt-8 text-center text-lg text-gray-400">
        ※ 입력 기능은 다음 단계에서 연동됩니다
      </p>
    </div>
  );
}
