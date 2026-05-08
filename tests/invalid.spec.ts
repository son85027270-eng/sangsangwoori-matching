import { test, expect } from '@playwright/test';
import { resetDb, getSupabase } from './helpers';

test.beforeEach(async () => {
  await resetDb();
});

test('이름 미입력 → 빨간 오류 박스 / DB 미저장', async ({ page }) => {
  await page.goto('/register');

  // 이름 비움, 나머지만 입력
  await page.selectOption('#region', '서울');
  await page.selectOption('#desired_job', '경비');
  await page.fill('#career_years', '3');
  await page.click('button[type="submit"]');

  // 빨간 안내 박스 노출 확인
  await expect(page.locator('text=이름을 입력해 주세요')).toBeVisible();

  // seniors 테이블에 새 레코드 없음 확인
  const { data } = await getSupabase().from('seniors').select('id');
  expect(data?.length ?? 0).toBe(0);
});
