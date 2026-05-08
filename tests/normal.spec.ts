import { test, expect } from '@playwright/test';
import { resetDb, seedJob } from './helpers';

// 사전 조건: 서울/경비/요구경력 3년 공고 1건
test.beforeEach(async () => {
  await resetDb();
  await seedJob({ title: '서울 경비원 모집', region: '서울', job_type: '경비', required_career: 3 });
});

test('시니어 등록 → 자동 매칭 → 추천 목록 상단 표시', async ({ page }) => {
  // 1. 프로필 등록
  await page.goto('/register');
  await page.fill('#name', '테스트시니어');
  await page.selectOption('#region', '서울');
  await page.selectOption('#desired_job', '경비');
  await page.fill('#career_years', '5');
  await page.click('button[type="submit"]');

  // 2. 성공 메시지 확인 (초록 박스)
  await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible();

  // 3. 추천 목록 확인 — 100점 카드 상단 표시
  await page.goto('/recommendations');
  await expect(page.locator('text=테스트시니어')).toBeVisible();
  // 지역(50) + 경력(30) + 직종(20) = 100점
  await expect(page.locator('text=100').first()).toBeVisible();
});
