import type { Senior, Job } from "./supabase";

const REGION_MAP: Record<string, string> = {
  서울특별시: "서울",
  경기도: "경기",
  인천광역시: "인천",
};

const JOB_MAP: Record<string, string> = {
  경비직: "경비",
  청소직: "청소",
  조리직: "조리",
  돌봄직: "돌봄",
};

function normalizeRegion(r: string): string {
  const t = r.trim();
  return REGION_MAP[t] ?? t;
}

function normalizeJob(j: string): string {
  const t = j.trim();
  return JOB_MAP[t] ?? t;
}

/**
 * 규칙 기반 매칭 점수 계산 (0~100점)
 *
 * 지역 일치:  +50점  (정규화 후 비교, 원본 미수정)
 * 경력 충족:  +30점  (senior.career_years >= job.required_career)
 * 직종 일치:  +20점  (정규화 후 부분 문자열 매칭, 원본 미수정)
 */
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;

  if (normalizeRegion(senior.region) === normalizeRegion(job.region)) {
    score += 50;
  }

  if (senior.career_years >= job.required_career) {
    score += 30;
  }

  const desired = normalizeJob(senior.desired_job).replace(/\s/g, "").toLowerCase();
  const jobType = normalizeJob(job.job_type).replace(/\s/g, "").toLowerCase();
  if (desired.includes(jobType) || jobType.includes(desired)) {
    score += 20;
  }

  return score;
}
