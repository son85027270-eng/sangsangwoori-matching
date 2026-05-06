import type { Senior, Job } from "./supabase";

/**
 * 규칙 기반 매칭 점수 계산 (0~100점)
 *
 * 지역 일치:  +50점
 * 경력 충족:  +30점  (senior.career_years >= job.required_career)
 * 직종 일치:  +20점  (부분 문자열 매칭)
 */
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;

  if (senior.region.trim() === job.region.trim()) {
    score += 50;
  }

  if (senior.career_years >= job.required_career) {
    score += 30;
  }

  const desired = senior.desired_job.replace(/\s/g, "").toLowerCase();
  const jobType = job.job_type.replace(/\s/g, "").toLowerCase();
  if (desired.includes(jobType) || jobType.includes(desired)) {
    score += 20;
  }

  return score;
}
