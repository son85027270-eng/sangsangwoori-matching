"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Job } from "@/lib/supabase";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

type FormState = {
  title: string;
  region: string;
  job_type: string;
  required_career: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { title: "", region: "", job_type: "", required_career: "" };

export default function JobManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [adding, setAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchJobs = useCallback(async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    setJobs((data as Job[]) ?? []);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.title.trim()) e.title = "공고명을 입력해 주세요.";
    if (!form.region) e.region = "지역을 선택해 주세요.";
    if (!form.job_type) e.job_type = "직종을 선택해 주세요.";
    return e;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setAdding(true);
    const { data: newJob, error } = await supabase
      .from("jobs")
      .insert({
        title: form.title.trim(),
        region: form.region,
        job_type: form.job_type,
        required_career: form.required_career ? Number(form.required_career) : 0,
      })
      .select()
      .single();

    if (error || !newJob) {
      setAddStatus("error");
    } else {
      // 새 일자리와 기존 시니어 전체 자동 재매칭
      await fetch("/api/rematch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: newJob.id }),
      });
      setAddStatus("success");
      setForm(INITIAL);
      setErrors({});
      await fetchJobs();
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("jobs").delete().eq("id", id);
    await fetchJobs();
  }

  return (
    <div className="mt-10 border-2 border-gray-200 rounded-2xl overflow-hidden">
      <div className="bg-gray-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">일자리 관리</h2>
      </div>

      <div className="p-6">
        {/* 일자리 추가 폼 */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">일자리 추가</h3>

        {addStatus === "success" && (
          <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-xl text-green-800 text-lg font-semibold">
            일자리가 등록되었습니다.
          </div>
        )}
        {addStatus === "error" && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-800 text-lg font-semibold">
            저장 중 오류가 발생했습니다.
          </div>
        )}

        <form onSubmit={handleAdd} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* 공고명 */}
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold text-gray-700">
              공고명 <span className="text-red-500">*</span>
            </label>
            {errors.title && (
              <div className="px-3 py-1 bg-red-50 border border-red-400 rounded text-red-700 text-sm">
                {errors.title}
              </div>
            )}
            <input
              name="title"
              type="text"
              placeholder="예: 강남구 아파트 경비원"
              value={form.title}
              onChange={handleChange}
              className={`border-2 rounded-xl px-4 py-3 text-lg focus:outline-none ${
                errors.title ? "border-red-400" : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          {/* 지역 */}
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold text-gray-700">
              지역 <span className="text-red-500">*</span>
            </label>
            {errors.region && (
              <div className="px-3 py-1 bg-red-50 border border-red-400 rounded text-red-700 text-sm">
                {errors.region}
              </div>
            )}
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className={`border-2 rounded-xl px-4 py-3 text-lg bg-white focus:outline-none ${
                errors.region ? "border-red-400" : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <option value="">지역 선택</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 직종 */}
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold text-gray-700">
              직종 <span className="text-red-500">*</span>
            </label>
            {errors.job_type && (
              <div className="px-3 py-1 bg-red-50 border border-red-400 rounded text-red-700 text-sm">
                {errors.job_type}
              </div>
            )}
            <select
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
              className={`border-2 rounded-xl px-4 py-3 text-lg bg-white focus:outline-none ${
                errors.job_type ? "border-red-400" : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <option value="">직종 선택</option>
              {JOB_TYPES.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* 요구 경력 */}
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold text-gray-700">
              요구 경력 (년)
              <span className="text-gray-400 text-sm font-normal ml-1">선택</span>
            </label>
            <input
              name="required_career"
              type="number"
              min="0"
              placeholder="예: 3"
              value={form.required_career}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={adding}
              className="w-full py-4 text-xl font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {adding ? "저장 중..." : "일자리 추가"}
            </button>
          </div>
        </form>

        {/* 일자리 목록 테이블 */}
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          등록된 일자리 ({jobs.length}건)
        </h3>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-lg">등록된 일자리가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-3 text-left font-semibold border-b-2 border-gray-200">공고명</th>
                  <th className="px-4 py-3 text-left font-semibold border-b-2 border-gray-200">지역</th>
                  <th className="px-4 py-3 text-left font-semibold border-b-2 border-gray-200">직종</th>
                  <th className="px-4 py-3 text-left font-semibold border-b-2 border-gray-200">요구 경력</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200"></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                    <td className="px-4 py-3 text-gray-700">{job.region}</td>
                    <td className="px-4 py-3 text-gray-700">{job.job_type}</td>
                    <td className="px-4 py-3 text-gray-700">{job.required_career}년 이상</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-4 py-2 text-base font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
