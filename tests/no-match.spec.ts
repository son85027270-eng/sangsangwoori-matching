import { test, expect } from '@playwright/test';
import { resetDb, seedJob } from './helpers';

// 사전 조건: 절대 매칭 안 되는 공고 (기타/기타/요구경력 99년)
// 서울/경비/3년 시니어와의 점수 = 0 → match 미생성
test.beforeEach(async () => {
  await resetDb();
  await seedJob({ title: '기타 업종', region: '기타', job_type: '기타', required_career: 99 });
});

test('매칭 점수 0 → 추천 목록 빈 화면 안내 표시', async ({ page }) => {
  // 시니어 등록 (서울/경비/3년)
  await page.goto('/register');
  await page.fill('#name', '테스트시니어2');
  await page.selectOption('#region', '서울');
  await page.selectOption('#desired_job', '경비');
  await page.fill('#career_years', '3');
  await page.click('button[type="submit"]');

  // 등록 완료 대기
  await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible();

  // 추천 목록 — 매칭 없음 안내 표시
  await page.goto('/recommendations');
  await expect(page.locator('text=현재 매칭되는 일자리가 없습니다')).toBeVisible();
});
