# Release Notes

## [Unreleased]

### ✨ Features

#### 2025-11-12
- **AI 페이지 빌더 초기 구현**
  - 이미지 업로드 및 Base64 변환 기능
  - Gemini Vision API 통합 (gemini-2.5-flash 모델)
  - PageSchema JSON 생성 (섹션 및 컴포넌트 구조)
  - 시각적 프리뷰 렌더링
  - React 컴포넌트 코드 생성
  - HTML 문서 코드 생성 (Tailwind CDN 포함)
  - 코드 포맷 선택 기능 (React/HTML 라디오 버튼)
  - 클립보드 복사 기능

### 🎨 UI/UX

#### 2025-11-12
- **페이지 빌더 UI 구현**
  - 4단계 섹션 레이아웃 (업로드 → JSON → 프리뷰 → 코드)
  - 파일 업로드 인터페이스 (이미지 미리보기 포함)
  - JSON 스키마 표시 (읽기 쉬운 포맷팅)
  - 동적 컴포넌트 렌더링 (시각적 프리뷰)
  - 코드 에디터 스타일 textarea
  - 로딩 상태 및 에러 메시지 UI
  - 라디오 버튼으로 코드 포맷 선택

### 🔧 Technical

#### 2025-11-12
- **프로젝트 초기 설정**
  - Next.js 16 + React 19 + TypeScript 프로젝트 생성
  - Tailwind CSS 4 설정 (@tailwindcss/postcss)
  - TypeScript 타입 정의 (PageSchema, Section, Component)
  - API Routes 구현 (/api/analyze-image, /api/generate-code)
  - 코드 생성기 서비스 (services/code-generator.ts)
  - Gemini Vision 서비스 (services/gemini/vision.ts)

- **빌드 최적화**
  - TypeScript JSX.IntrinsicElements 타입 에러 해결
  - Tailwind CSS 4 PostCSS 플러그인 설정
  - next.config.js typedRoutes 설정 업데이트
  - 프로덕션 빌드 성공 (7개 페이지)

### 📝 Documentation

#### 2025-11-12
- **프로젝트 문서화**
  - CLAUDE.md 생성 (작업 관리 규칙)
  - TASK.md 생성 (Phase별 구현 계획)
  - Phase 1-7 작업 내역 기록
  - 예상 vs 실제 소요 시간 추적

---

## 버전 히스토리

### [0.1.0] - 2025-11-12

#### Added
- 최초 릴리즈: AI 페이지 빌더 MVP 구현
- Gemini Vision API를 통한 이미지 분석
- React 및 HTML 코드 자동 생성
- 시각적 프리뷰 기능
- 21개 슬라이드 타입 지원 (hero, feature, testimonial, cta 등)

#### Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Google Gemini API (gemini-2.5-flash)

---

**릴리즈 노트 규칙**:
- 모든 커밋 시 [Unreleased] 섹션 업데이트
- 커밋 타입별 분류 (✨ Features, 🐛 Fixes, 🎨 UI/UX, 🔧 Technical, 📝 Documentation)
- 날짜별로 그룹화
- 커밋 해시는 생략 가능 (직전 변경사항)
