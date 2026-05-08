"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

type FormState = {
  name: string;
  region: string;
  desired_job: string;
  career_years: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { name: "", region: "", desired_job: "", career_years: "" };

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!form.region) e.region = "지역을 선택해 주세요.";
    if (!form.desired_job) e.desired_job = "희망 직종을 선택해 주세요.";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitStatus("loading");

    const { data: senior, error } = await supabase
      .from("seniors")
      .insert({
        name: form.name.trim(),
        region: form.region,
        desired_job: form.desired_job,
        career_years: form.career_years ? Number(form.career_years) : 0,
      })
      .select()
      .single();

    if (error || !senior) {
      setSubmitStatus("error");
      return;
    }

    await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seniorId: senior.id }),
    });

    setSubmitStatus("success");
    setForm(INITIAL);
    setErrors({});
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 일자리 신청하기</h1>
      <p className="text-xl text-gray-600 mb-10">
        아래 정보를 입력하시면 맞는 일자리를 자동으로 찾아드립니다
      </p>

      {submitStatus === "success" && (
        <div className="mb-8 p-5 bg-green-50 border-2 border-green-500 rounded-2xl text-xl font-semibold text-green-800">
          등록이 완료되었습니다. 담당자가 곧 연락드립니다
        </div>
      )}
      {submitStatus === "error" && (
        <div className="mb-8 p-5 bg-red-50 border-2 border-red-500 rounded-2xl text-xl font-semibold text-red-800">
          저장 중 오류가 발생했습니다. 다시 시도해 주세요.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xl font-semibold text-gray-800">
            이름 <span className="text-red-500">*</span>
          </label>
          <p className="text-lg text-gray-500">성함을 입력해 주세요</p>
          {errors.name && (
            <div className="px-4 py-2 bg-red-50 border border-red-400 rounded-lg text-red-700 text-lg font-medium">
              {errors.name}
            </div>
          )}
          <input
            id="name"
            name="name"
            type="text"
            placeholder="홍길동"
            value={form.name}
            onChange={handleChange}
            className={`border-2 rounded-xl px-5 py-4 text-xl focus:outline-none ${
              errors.name
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          />
        </div>

        {/* 지역 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="region" className="text-xl font-semibold text-gray-800">
            지역 <span className="text-red-500">*</span>
          </label>
          <p className="text-lg text-gray-500">어디에서 일하고 싶으세요?</p>
          {errors.region && (
            <div className="px-4 py-2 bg-red-50 border border-red-400 rounded-lg text-red-700 text-lg font-medium">
              {errors.region}
            </div>
          )}
          <select
            id="region"
            name="region"
            value={form.region}
            onChange={handleChange}
            className={`border-2 rounded-xl px-5 py-4 text-xl bg-white focus:outline-none ${
              errors.region
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          >
            <option value="">지역 선택</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* 희망 직종 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">
            희망 직종 <span className="text-red-500">*</span>
          </label>
          <p className="text-lg text-gray-500">어떤 일을 하고 싶으세요?</p>
          {errors.desired_job && (
            <div className="px-4 py-2 bg-red-50 border border-red-400 rounded-lg text-red-700 text-lg font-medium">
              {errors.desired_job}
            </div>
          )}
          <select
            id="desired_job"
            name="desired_job"
            value={form.desired_job}
            onChange={handleChange}
            className={`border-2 rounded-xl px-5 py-4 text-xl bg-white focus:outline-none ${
              errors.desired_job
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          >
            <option value="">직종 선택</option>
            {JOB_TYPES.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        {/* 경력 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
            경력 (년) <span className="text-gray-400 text-base font-normal">선택</span>
          </label>
          <p className="text-lg text-gray-500">일한 경험이 몇 년이나 되셨나요?</p>
          <input
            id="career_years"
            name="career_years"
            type="number"
            min="0"
            placeholder="예: 10"
            value={form.career_years}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="mt-4 py-4 text-2xl font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
        >
          {submitStatus === "loading" ? "저장 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
}
