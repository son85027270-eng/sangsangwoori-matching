-- matches 테이블에 status 컬럼 추가
ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'assigned'));

CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- upsert를 위한 unique constraint (senior_id + job_id 조합은 유일)
ALTER TABLE matches
  ADD CONSTRAINT IF NOT EXISTS matches_senior_job_unique UNIQUE (senior_id, job_id);
