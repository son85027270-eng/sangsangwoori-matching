# 상상우리 매칭 시스템

시니어 구직자와 일자리를 자동으로 연결하는 규칙 기반 매칭 웹 서비스입니다.

## 주요 기능

- **시니어 프로필 등록** — 지역, 희망 직종, 경력 연수 입력
- **자동 매칭** — 지역·직종·경력 기반 점수 계산 (최고 100점)
- **추천 일자리 보기** — 매칭 점수 순 정렬
- **담당자 대시보드** — 일자리 CRUD, 전체 매칭 결과 열람, 수동 재매칭

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| UI | Tailwind CSS |
| 백엔드/DB | Supabase (PostgreSQL) |
| 언어 | TypeScript |

## 매칭 알고리즘

| 조건 | 점수 |
|------|------|
| 지역 일치 | +50점 |
| 경력 연수 충족 | +30점 |
| 직종 일치 (부분 매칭) | +20점 |

## 시작하기

### 1. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`을 열고 Supabase 프로젝트의 URL과 anon key를 입력합니다.  
([Supabase 대시보드](https://supabase.com) → 프로젝트 선택 → Project Settings → API)

### 2. Supabase 테이블 생성

Supabase SQL Editor에서 아래 쿼리를 실행합니다.

```sql
create table seniors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  desired_job text not null,
  career_years int not null default 0,
  created_at timestamptz default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  region text not null,
  job_type text not null,
  required_career int not null default 0,
  created_at timestamptz default now()
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid references seniors(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  score int not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);
```

### 3. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 메인 홈 |
| `/register` | 시니어 프로필 등록 |
| `/recommendations` | 추천 일자리 목록 |
| `/admin` | 담당자 대시보드 (일자리 관리 + 매칭 현황) |
