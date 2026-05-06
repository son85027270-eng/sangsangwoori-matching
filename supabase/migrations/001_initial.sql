-- =============================================================
-- 상상우리 시니어 일자리 매칭 시스템 — 초기 스키마
-- 학습 환경 전용: RLS 비활성화 (실서비스 전 반드시 재설계)
-- =============================================================

-- seniors 테이블
CREATE TABLE IF NOT EXISTS seniors (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  region       text        NOT NULL,
  desired_job  text        NOT NULL,
  career_years integer     NOT NULL CHECK (career_years >= 0),
  created_at   timestamptz DEFAULT now()
);

-- jobs 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  region          text        NOT NULL,
  job_type        text        NOT NULL,
  required_career integer     NOT NULL CHECK (required_career >= 0),
  created_at      timestamptz DEFAULT now()
);

-- matches 테이블 (FK → seniors, jobs)
CREATE TABLE IF NOT EXISTS matches (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id  uuid    NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  job_id     uuid    NOT NULL REFERENCES jobs(id)    ON DELETE CASCADE,
  score      numeric NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_matches_senior_id ON matches(senior_id);
CREATE INDEX IF NOT EXISTS idx_matches_job_id    ON matches(job_id);
CREATE INDEX IF NOT EXISTS idx_matches_score     ON matches(score DESC);

-- RLS 비활성화 (학습 환경 전용 — 실서비스 전에 반드시 재설계)
ALTER TABLE seniors DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs    DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
