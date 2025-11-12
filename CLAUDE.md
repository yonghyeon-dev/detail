# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# AI 페이지 빌더 프로젝트

> **프로젝트 타입**: 개인 검증 프로젝트 (Wireframe MVP)
> **프레임워크**: Next.js 16 (App Router) + React 19
> **개발 기간**: 2-3일
> **목적**: AI 정확도 검증 및 프로토타입 테스트

---

## 📚 문서 네비게이션

| 문서 | 역할 |
|------|------|
| **docs/PRD.md** | 프로젝트 요구사항 명세서 (개인용 버전) |
| **TASK.md** | 현재 작업 계획 및 진행 상황 |
| **CLAUDE.md** | 개발 가이드 (현재 문서) |

---

## 🎯 프로젝트 개요

**핵심 컨셉**: "이미지 업로드 → AI 분석 → React 코드 생성"

### 목적
- ✅ AI 정확도 검증 (Gemini Vision API)
- ✅ 프롬프트 최적화
- ✅ 기술적 실현 가능성 확인
- ✅ 빠른 검증 (2-3일)

### 제외 사항 (와이어프레임 MVP)
- ❌ 복잡한 UI (shadcn/ui, Radix UI)
- ❌ 편집 기능
- ❌ 데이터베이스
- ❌ 인증 시스템

---

## 🚀 빠른 시작

### 개발 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npx tsc --noEmit     # TypeScript 타입 체크
```

### 환경 변수

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

---

## ⚠️ 필수 규칙

### 1. 한글 소통
- 모든 응답, 설명, 코드 주석은 한국어로 작성
- 커밋 메시지는 한국어로 작성

### 2. 파일 구조

```
detail/
├── CLAUDE.md                 # 개발 가이드 (현재 문서)
├── TASK.md                   # 작업 계획 및 진행 상황
├── docs/
│   └── PRD.md                # 프로젝트 요구사항
├── app/
│   ├── page-builder/
│   │   └── page.tsx          # 메인 UI 페이지
│   └── api/
│       ├── analyze-image/
│       │   └── route.ts      # AI 분석 API
│       └── generate-code/
│           └── route.ts      # 코드 생성 API
├── services/
│   ├── gemini/
│   │   └── vision.ts         # Gemini Vision 통합
│   └── code-generator.ts     # 코드 생성 로직
└── types/
    └── page-builder.ts       # 타입 정의
```

**총 파일 수**: 6개
**총 코드 라인**: ~300줄

---

## 📝 작업 관리

**모든 복잡한 작업은 TASK.md를 생성하여 체계적으로 관리합니다.**

### TASK.md 사용 시나리오

**다음 경우에 TASK.md를 생성합니다**:
- 3개 이상의 Phase로 구성된 작업
- 여러 파일을 수정해야 하는 작업 (>5개)
- 단계별 검증이 필요한 작업
- 장시간 소요될 것으로 예상되는 작업 (>1시간)

### TASK.md 구조

```markdown
# [작업명] (YYYY-MM-DD)

## 📋 작업 개요
[작업에 대한 간략한 설명]

## 🎯 Phase 1: [Phase 제목]
**목표**: [이 Phase의 목표]

### 체크리스트
- [ ] 작업 1
- [ ] 작업 2
- [ ] 작업 3

**파일**: [수정할 파일 목록]
**변경 사항**: [구체적인 변경 내용]

## 📝 작업 진행 상황
### Phase 1: [제목]
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 테스트 완료

[추가 Phase들...]

## 🔍 테스트 체크리스트
- [ ] 테스트 항목 1
- [ ] 테스트 항목 2

## 📊 예상 소요 시간
| Phase | 예상 시간 | 실제 시간 |
|-------|----------|----------|
| Phase 1 | XX분 | - |
```

### TodoWrite 도구 연동

**실시간 진행상황 추적**:
1. Phase 시작 시 TodoWrite로 todo 생성
2. Phase 완료 시 즉시 상태 업데이트
3. 항상 하나의 Phase만 `in_progress` 상태 유지

**예시**:
```typescript
TodoWrite([
  { content: "Phase 1: 타입 정의", status: "in_progress", activeForm: "타입 정의 작업 중" },
  { content: "Phase 2: Gemini Vision 통합", status: "pending", activeForm: "Gemini Vision 통합 중" },
  { content: "Phase 3: 코드 생성기", status: "pending", activeForm: "코드 생성기 구현 중" }
])
```

### CLAUDE.md 업데이트

**작업 완료 후 필수 업데이트**:
- 새로운 규칙이나 패턴 추가
- 작업 관리 프로세스 개선사항 반영
- 참조할 만한 예시 추가

### 작업 흐름 (Workflow)

1. **계획 (Planning)**
   - 작업 요구사항 분석
   - Phase 단위로 분해
   - TASK.md 생성

2. **실행 (Execution)**
   - Phase별로 순차 진행
   - TodoWrite로 실시간 추적
   - 각 Phase 완료 시 체크리스트 업데이트

3. **검증 (Validation)**
   - Phase 완료 후 즉시 테스트
   - 에러 발생 시 즉시 수정
   - 다음 Phase로 진행 전 확인

4. **문서화 (Documentation)**
   - TASK.md 최종 업데이트
   - CLAUDE.md에 새로운 패턴 추가
   - 필요시 PRD.md 업데이트

---

## 🛠️ 기술 스택

### 사용 (이미 설치됨)

| 카테고리 | 기술 | 용도 |
|---------|------|------|
| **프레임워크** | Next.js 16 | SSR, API Routes |
| **UI 라이브러리** | React 19 | 컴포넌트 |
| **언어** | TypeScript | 타입 안정성 |
| **스타일** | Tailwind CSS | 최소 스타일 |
| **AI** | Gemini Vision API | 이미지 분석 |

### 추가 필요

```bash
npm install @google/generative-ai
```

---

## 🎯 주요 개발 플로우

### 1. 새로운 타입 추가
```
1. types/page-builder.ts 수정
2. npx tsc --noEmit 확인
3. 관련 파일 업데이트
```

### 2. API Route 추가
```
1. app/api/[endpoint]/route.ts 생성
2. POST 핸들러 구현
3. 에러 처리 추가
4. 타입 정의 확인
```

### 3. 새로운 서비스 추가
```
1. services/[service].ts 생성
2. 비즈니스 로직 구현
3. 타입 정의
4. API Route에서 호출
```

---

## 🧪 테스트

### 타입 체크
```bash
npx tsc --noEmit
```

### 개발 서버
```bash
npm run dev
# http://localhost:3000/page-builder
```

### 테스트 이미지
- 랜딩 페이지 스크린샷
- 카드 그리드 레이아웃
- 리뷰 섹션
- CTA 버튼 영역

---

## 🔧 트러블슈팅

### Gemini API 에러
```bash
# 환경 변수 확인
echo $NEXT_PUBLIC_GEMINI_API_KEY

# .env.local에 추가
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### TypeScript 에러
```bash
# 타입 체크
npx tsc --noEmit

# 특정 파일 확인
npx tsc --noEmit path/to/file.ts
```

### Next.js 빌드 에러
```bash
# 캐시 삭제
rm -rf .next

# 재빌드
npm run build
```

---

## 📊 프로젝트 현황

**현재 Phase**: Phase 0 (설계 및 문서화)

**완료된 작업**:
- ✅ PRD.md 작성 (개인용 버전)
- ✅ CLAUDE.md 생성 (작업 관리 규칙 포함)
- ✅ TASK.md 템플릿 정의

**다음 작업**:
- 🚧 Phase 1: 타입 정의
- 🚧 Phase 2: Gemini Vision 통합
- 🚧 Phase 3: 코드 생성기
- 🚧 Phase 4: API Routes
- 🚧 Phase 5: 메인 UI 페이지
- 🚧 Phase 6: 테스트 및 검증

---

**문서 버전**: 1.0
**최근 업데이트**: 2025-11-12
**유지보수**: 이 문서는 프로젝트와 함께 살아있는 문서입니다. 주요 변경 시 업데이트해주세요.
