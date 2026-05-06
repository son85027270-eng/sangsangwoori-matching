"use client";

import { useState } from "react";

export default function RematchButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  async function handleRematch() {
    setStatus("loading");
    const res = await fetch("/api/rematch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const { matched } = await res.json();
      setCount(matched);
      setStatus("done");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleRematch}
        disabled={status === "loading"}
        className="px-6 py-3 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "재계산 중..." : "전체 매칭 재계산"}
      </button>
      {status === "done" && (
        <span className="text-lg font-semibold text-green-700">
          완료 — {count}건 매칭 업데이트됨. 페이지를 새로고침하면 반영됩니다.
        </span>
      )}
      {status === "error" && (
        <span className="text-lg font-semibold text-red-600">오류가 발생했습니다.</span>
      )}
    </div>
  );
}
