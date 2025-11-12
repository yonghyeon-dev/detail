# 📋 PRD: AI 페이지 빌더 - 개인용 검증 버전 (Wireframe MVP)

> **버전**: 0.1 (Wireframe MVP)
> **작성일**: 2025-11-12
> **프로젝트 타입**: 개인 기술 검증 프로젝트
> **개발 기간**: **2-3일**
> **목적**: AI 정확도 검증 및 프로토타입 테스트

---

## 🎯 프로젝트 개요

### 핵심 컨셉
**"이미지 업로드 → AI 분석 → React 코드 생성 (최소 기능 검증)"**

### 목적
- ✅ **AI 정확도 검증**: Gemini Vision API가 실제로 레이아웃을 인식할 수 있는지 테스트
- ✅ **프롬프트 최적화**: 어떤 프롬프트가 가장 정확한지 실험
- ✅ **기술적 실현 가능성**: 풀 버전 개발 전 리스크 확인
- ✅ **빠른 검증**: 2-3일 안에 작동하는 프로토타입

### 제외 사항 (풀 버전에서만)
- ❌ 복잡한 UI (shadcn/ui, Radix UI)
- ❌ 편집 기능 (속성 패널, 드래그 앤 드롭)
- ❌ 데이터베이스 (Prisma, Supabase)
- ❌ 인증 시스템 (NextAuth)
- ❌ 권한 관리 (Zanzibar)
- ❌ 크레딧 시스템
- ❌ 구독 모델

---

## 📋 목차

1. [범위 및 기능](#-범위-및-기능)
2. [기술 스택](#-기술-스택)
3. [핵심 기능 명세](#-핵심-기능-명세)
4. [시스템 아키텍처](#-시스템-아키텍처)
5. [UI 설계 (와이어프레임)](#-ui-설계-와이어프레임)
6. [구현 로드맵 (2-3일)](#-구현-로드맵-2-3일)
7. [테스트 계획](#-테스트-계획)
8. [비용 분석](#-비용-분석)
9. [검증 지표](#-검증-지표)
10. [다음 단계](#-다음-단계)

---

## 📦 범위 및 기능

### 포함 기능 (Must Have - 4개만)

| 번호 | 기능 | 설명 | 예상 시간 |
|------|------|------|-----------|
| 1️⃣ | **이미지 업로드** | 단순 file input, 미리보기 | 1시간 |
| 2️⃣ | **AI 분석** | Gemini Vision API → JSON | 3시간 |
| 3️⃣ | **렌더링 프리뷰** | JSON → HTML 표시 | 2시간 |
| 4️⃣ | **코드 생성** | JSON → React 코드, 복사 | 2시간 |

**총 핵심 기능**: 4개
**총 예상 시간**: 8시간 (Day 1)

---

### 제외 기능 (풀 버전에서만)

| 기능 | 이유 |
|------|------|
| 편집 기능 | 검증 목적에 불필요 |
| 데이터베이스 | 로컬 테스트만 |
| 인증 | 혼자 사용 |
| 속성 패널 | 복잡도 높음 |
| 드래그 앤 드롭 | 시간 소요 큼 |
| 반응형 | 데스크톱만 |
| 자동 저장 | 세션만 |
| 프로젝트 관리 | 단일 테스트만 |

---

## 🛠️ 기술 스택

### 사용 (이미 프로젝트에 있음)

| 카테고리 | 기술 | 상태 | 용도 |
|---------|------|------|------|
| **프레임워크** | Next.js 16 | ✅ 사용 중 | SSR, API Routes |
| **UI 라이브러리** | React 19 | ✅ 사용 중 | 컴포넌트 |
| **언어** | TypeScript | ✅ 사용 중 | 타입 안정성 |
| **스타일** | Tailwind CSS | ✅ 사용 중 | 최소 스타일만 |
| **AI** | Gemini Vision API | ✅ API 키 있음 | 이미지 분석 |

### 추가 필요 (1개만)

| 라이브러리 | 용도 | 설치 명령어 |
|-----------|------|-------------|
| `@google/generative-ai` | Gemini API SDK | `npm install @google/generative-ai` |

### 제거 (사용 안 함)

- ❌ shadcn/ui, Radix UI
- ❌ Zustand (useState만 사용)
- ❌ Prisma, Supabase
- ❌ NextAuth
- ❌ react-dropzone (기본 input 사용)
- ❌ jszip (복사만)

---

## ⚙️ 핵심 기능 명세

### 기능 1: 이미지 업로드 (1시간)

**UI**:
```tsx
<input type="file" accept="image/*" onChange={handleUpload} />
{image && <img src={image} className="max-w-md" />}
```

**기능**:
- 파일 선택 (PNG, JPG, WebP)
- Base64 인코딩
- 미리보기 표시

**제한**:
- 최대 크기: 2MB
- 1개만 업로드

---

### 기능 2: AI 분석 (3시간)

**API**: `POST /api/analyze-image`

**입력**:
```json
{
  "image": "data:image/png;base64,..."
}
```

**처리**:
1. Gemini Vision API 호출
2. 프롬프트: "웹페이지 스크린샷을 JSON으로 변환"
3. 응답 파싱 (```json ... ``` 제거)

**출력**:
```json
{
  "sections": [
    {
      "type": "hero",
      "background": "bg-blue-600",
      "components": [
        {
          "type": "heading",
          "content": "들려주세요 당신의 여행기",
          "className": "text-4xl font-bold text-white"
        }
      ]
    }
  ]
}
```

**핵심 코드**:
```typescript
// services/gemini/vision.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function analyzeImage(imageBase64: string) {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

  const prompt = `
웹페이지 스크린샷을 분석하여 JSON으로 변환:

{
  "sections": [
    {
      "type": "hero | feature | testimonial",
      "background": "bg-색상",
      "components": [
        {
          "type": "heading | badge | card",
          "content": "텍스트",
          "className": "Tailwind 클래스"
        }
      ]
    }
  ]
}

간단히 3-5개 컴포넌트만.
`

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/png' } }
  ])

  const text = result.response.text()
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
  return JSON.parse(jsonMatch ? jsonMatch[1] : text)
}
```

---

### 기능 3: 렌더링 프리뷰 (2시간)

**UI**:
```tsx
<div className="border">
  {schema.sections?.map((section, i) => (
    <div key={i} className={section.background + ' p-8'}>
      {section.components?.map((comp, j) => (
        <div key={j} className={comp.className}>
          {comp.content}
        </div>
      ))}
    </div>
  ))}
</div>
```

**기능**:
- JSON → HTML 변환
- Tailwind 클래스 적용
- 읽기 전용 (편집 불가)

---

### 기능 4: 코드 생성 (2시간)

**API**: `POST /api/generate-code`

**입력**:
```json
{
  "schema": { ... }
}
```

**처리**:
```typescript
// services/code-generator.ts
export function generateReactCode(schema: PageSchema): string {
  let code = 'export default function Page() {\n  return (\n'

  schema.sections.forEach((section) => {
    code += `    <section className="${section.background} p-8">\n`
    section.components.forEach((comp) => {
      code += `      <${comp.type} className="${comp.className}">${comp.content}</${comp.type}>\n`
    })
    code += '    </section>\n'
  })

  code += '  )\n}'
  return code
}
```

**출력**:
```tsx
export default function Page() {
  return (
    <section className="bg-blue-600 p-8">
      <h1 className="text-4xl font-bold text-white">들려주세요 당신의 여행기</h1>
    </section>
  )
}
```

**UI**:
```tsx
<textarea value={code} className="w-full h-64 font-mono" readOnly />
<button onClick={() => navigator.clipboard.writeText(code)}>
  코드 복사
</button>
```

---

## 🏗️ 시스템 아키텍처

### 초간단 구조

```
┌─────────────────────────────────────────┐
│        Browser (React)                  │
│  ┌───────────────────────────────────┐ │
│  │ app/page-builder/page.tsx         │ │
│  │ - useState (image, schema, code)  │ │
│  │ - 4개 섹션 (업로드/JSON/프리뷰/코드)│ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼ fetch()
┌─────────────────────────────────────────┐
│       API Routes (Next.js)              │
│  ┌───────────────────────────────────┐ │
│  │ POST /api/analyze-image           │ │
│  │ - Gemini Vision 호출              │ │
│  │ - JSON 반환                       │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ POST /api/generate-code           │ │
│  │ - JSON → React 코드 변환          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼ API call
┌─────────────────────────────────────────┐
│       Gemini Pro Vision API             │
│  - 이미지 분석                          │
│  - JSON 응답                            │
└─────────────────────────────────────────┘
```

### 파일 구조

```
app/
  page-builder/
    page.tsx                    # 메인 페이지 (단일 파일)
  api/
    analyze-image/
      route.ts                  # AI 분석 API
    generate-code/
      route.ts                  # 코드 생성 API

services/
  gemini/
    vision.ts                   # Gemini Vision 통합
  code-generator.ts             # 코드 생성 로직

types/
  page-builder.ts               # 타입 정의 (3개)
```

**총 파일 수**: **6개**
**총 코드 라인**: **~300줄**

---

## 🎨 UI 설계 (와이어프레임)

### 단일 페이지 레이아웃

```
┌──────────────────────────────────────────────────────┐
│ PageForge - Wireframe MVP                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ [1] 이미지 업로드                                     │
│ ┌────────────────────────────────────────────────┐ │
│ │ [파일 선택] screenshot.png                      │ │
│ │                                                │ │
│ │ [이미지 미리보기 영역]                          │ │
│ │                                                │ │
│ │ [ AI 분석 시작 ]  ← 파란 버튼                  │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ [2] AI 분석 결과 (JSON)                              │
│ ┌────────────────────────────────────────────────┐ │
│ │ {                                              │ │
│ │   "sections": [...]                           │ │
│ │ }                                              │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ [3] 렌더링 프리뷰                                     │
│ ┌────────────────────────────────────────────────┐ │
│ │ [히어로 섹션]                                   │ │
│ │   들려주세요 당신의 여행기                      │ │
│ │                                                │ │
│ │ [카드 섹션]                                     │ │
│ │   DOORA*** ⭐⭐⭐⭐⭐                           │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ [4] 생성된 코드                                       │
│ ┌────────────────────────────────────────────────┐ │
│ │ export default function Page() {               │ │
│ │   return <section>...</section>                │ │
│ │ }                                              │ │
│ │                                                │ │
│ │ [ 코드 복사 ]  ← 초록 버튼                     │ │
│ └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 스타일 (최소)

```css
/* 기본 스타일만 */
background: white
text: black
border: gray-300
button-primary: blue-500
button-success: green-500
padding: 기본값
margin: 기본값
```

---

## 🗓️ 구현 로드맵 (2-3일)

### Day 1: 기반 + AI 통합 (6-8시간)

#### 오전 (3-4시간)

**1. 프로젝트 설정** (30분)
```bash
# 1. 의존성 설치
npm install @google/generative-ai

# 2. 환경 변수 확인
echo "NEXT_PUBLIC_GEMINI_API_KEY=이미_있음" >> .env.local

# 3. 디렉토리 생성
mkdir -p app/page-builder
mkdir -p app/api/analyze-image
mkdir -p app/api/generate-code
mkdir -p services/gemini
```

**2. 기본 페이지** (1시간)
- [ ] `app/page-builder/page.tsx` 생성
- [ ] 4개 섹션 레이아웃
- [ ] 기본 스타일링

**3. 이미지 업로드** (1시간)
- [ ] File input
- [ ] Base64 인코딩
- [ ] 미리보기

**4. 타입 정의** (30분)
- [ ] `types/page-builder.ts`
- [ ] PageSchema, Section, Component

#### 오후 (3-4시간)

**5. Gemini Vision 통합** (2시간)
- [ ] `services/gemini/vision.ts`
- [ ] 프롬프트 작성
- [ ] 에러 핸들링

**6. AI 분석 API** (1.5시간)
- [ ] `app/api/analyze-image/route.ts`
- [ ] Gemini 호출
- [ ] JSON 파싱

**7. 테스트** (30분)
- [ ] 샘플 이미지 3개
- [ ] AI 분석 성공 확인

---

### Day 2: 렌더링 + 코드 생성 (6-8시간)

#### 오전 (3-4시간)

**8. 렌더링 엔진** (2시간)
- [ ] JSON → HTML 변환 함수
- [ ] 캔버스 컴포넌트
- [ ] Tailwind 클래스 적용

**9. JSON 표시** (1시간)
- [ ] JSON pretty print
- [ ] 스크롤 가능
- [ ] 복사 버튼 (선택)

#### 오후 (3-4시간)

**10. 코드 생성기** (2시간)
- [ ] `services/code-generator.ts`
- [ ] JSON → React 코드 변환
- [ ] 기본 포맷팅

**11. 코드 생성 API** (1시간)
- [ ] `app/api/generate-code/route.ts`
- [ ] 코드 생성 호출
- [ ] 응답 반환

**12. 코드 표시 UI** (1시간)
- [ ] Textarea에 코드 표시
- [ ] 복사 버튼
- [ ] 성공 알림

---

### Day 3: 통합 + 테스트 (4-6시간)

#### 오전 (2-3시간)

**13. 전체 플로우 연결** (1시간)
- [ ] 업로드 → 분석 → 렌더링 → 코드
- [ ] 로딩 상태
- [ ] 에러 처리

**14. UI 개선** (1시간)
- [ ] 로딩 스피너
- [ ] 에러 메시지
- [ ] 성공 알림 (toast)

#### 오후 (2-3시간)

**15. 통합 테스트** (1.5시간)
- [ ] 실제 이미지 10개 테스트
- [ ] 다양한 레이아웃 (히어로, 피처, CTA)
- [ ] 에지 케이스 (큰 이미지, 복잡한 레이아웃)

**16. 프롬프트 최적화** (1시간)
- [ ] A/B 테스트 (2-3개 프롬프트)
- [ ] 정확도 비교
- [ ] 최적 프롬프트 선택

**17. 문서 작성** (30분)
- [ ] README 업데이트
- [ ] 테스트 결과 기록
- [ ] 다음 단계 계획

---

### 총 예상 시간

| Day | 작업 시간 | 누적 |
|-----|----------|------|
| Day 1 | 6-8시간 | 6-8시간 |
| Day 2 | 6-8시간 | 12-16시간 |
| Day 3 | 4-6시간 | **16-22시간** |

**예상 총 기간**: **2-3일** (하루 8시간 기준)

---

## 🧪 테스트 계획

### 테스트 이미지 (10개 준비)

| 번호 | 타입 | 설명 | 예상 정확도 |
|------|------|------|-------------|
| 1 | 히어로 (단순) | 제목 + 버튼 | 90%+ |
| 2 | 히어로 (복잡) | 배경 이미지 + 텍스트 | 70-80% |
| 3 | 피처 (3개 카드) | 그리드 레이아웃 | 80%+ |
| 4 | 피처 (4개 카드) | 2x2 그리드 | 75%+ |
| 5 | 후기 (카드) | 별점 + 텍스트 | 85%+ |
| 6 | CTA (단순) | 제목 + 버튼 | 90%+ |
| 7 | 혼합 (히어로 + 피처) | 2개 섹션 | 70-80% |
| 8 | 복잡한 레이아웃 | 3개 이상 섹션 | 60-70% |
| 9 | 텍스트 많음 | 긴 문장 | 75%+ |
| 10 | 이미지 많음 | 사진 중심 | 65-75% |

### 정확도 측정 기준

**정확도 = (정확한 컴포넌트 수 / 전체 컴포넌트 수) × 100**

**평가 항목**:
1. ✅ 섹션 타입 인식 (hero, feature, testimonial)
2. ✅ 컴포넌트 타입 인식 (heading, badge, card)
3. ✅ 텍스트 추출 (OCR)
4. ✅ 레이아웃 구조 (flex, grid)
5. ⚠️ 색상 인식 (Tailwind 클래스)

### 성공 기준

| 정확도 | 결과 | 다음 단계 |
|--------|------|-----------|
| **> 80%** | ✅ 성공 | 풀 버전 개발 진행 |
| **70-80%** | ⚠️ 보통 | 프롬프트 개선 후 재평가 |
| **< 70%** | ❌ 실패 | 중단 또는 다른 접근 고려 |

### 테스트 스크립트

```bash
# Day 3 오후에 실행

# 1. 이미지 준비
mkdir test-images
# 10개 이미지 다운로드 또는 스크린샷

# 2. 테스트 실행
npm run dev
open http://localhost:3000/page-builder

# 3. 각 이미지 테스트
# - 업로드
# - AI 분석
# - 결과 기록 (정확도 %)

# 4. 결과 정리
# - 평균 정확도 계산
# - 성공/실패 판단
# - 다음 단계 결정
```

---

## 💰 비용 분석

### 개발 비용

| 항목 | 시간 | 비용 (시급 5만원 기준) |
|------|------|------------------------|
| Day 1 | 6-8시간 | 30-40만원 |
| Day 2 | 6-8시간 | 30-40만원 |
| Day 3 | 4-6시간 | 20-30만원 |
| **총** | **16-22시간** | **80-110만원** |

**실제 비용**: **개인 개발이므로 0원** (시간만 투자)

---

### 운영 비용 (월)

| 항목 | 비용 | 비고 |
|------|------|------|
| **AI 비용** | | |
| Gemini Vision API | 150원/이미지 | 개인 사용 |
| 월 10개 분석 | 1,500원 | 가벼운 사용 |
| 월 30개 분석 | 4,500원 | 많이 사용 |
| | | |
| **인프라 비용** | | |
| Vercel (무료 티어) | 0원 | Hobby 플랜 |
| 데이터베이스 | 0원 | 없음 |
| 스토리지 | 0원 | 없음 |
| | | |
| **총 월 비용** | **1,500-4,500원** | AI 사용량에 따라 |

---

### 비용 비교 (풀 버전 vs 와이어프레임)

| 항목 | 와이어프레임 MVP | 풀 버전 (PRD) |
|------|------------------|---------------|
| **개발 시간** | 2-3일 (16-22시간) | 8주 (195시간) |
| **개발 비용** | 0원 (개인) | 0원 (개인) |
| **월 운영비** | 1,500-4,500원 | 0원 (무료 티어) |
| **파일 수** | 6개 | 50개+ |
| **코드 라인** | ~300줄 | ~5,000줄 |
| **의존성** | +1개 | +10개 |
| **기능 수** | 4개 | 15개+ |
| **복잡도** | ★☆☆☆☆ | ★★★★★ |

---

## 📊 검증 지표

### 주요 지표 (1주일 테스트)

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **AI 정확도** | > 80% | 10개 이미지 평균 |
| **응답 시간** | < 30초 | API 응답 시간 |
| **에러율** | < 5% | 실패 횟수 / 전체 횟수 |
| **만족도** | 주관적 | 개인 평가 (1-5점) |

### 검증 프로세스

```
Day 1-2: 구현
   ↓
Day 3: 통합 테스트 (10개 이미지)
   ↓
Week 1: 실제 사용 (30-50개 이미지)
   ↓
평가: 정확도 > 80%?
   ├─ Yes → 풀 버전 개발 진행
   └─ No → 프롬프트 개선 또는 중단
```

### 의사결정 매트릭스

| 정확도 | 응답 시간 | 결정 |
|--------|----------|------|
| > 80% | < 30초 | ✅ 풀 버전 진행 |
| > 80% | > 30초 | ⚠️ 성능 개선 후 진행 |
| 70-80% | < 30초 | ⚠️ 프롬프트 개선 후 재평가 |
| 70-80% | > 30초 | ⚠️ 종합 개선 필요 |
| < 70% | 상관없음 | ❌ 중단 고려 |

---

## 🚀 다음 단계

### 단계 1: 와이어프레임 MVP (현재)

**목표**: AI 정확도 검증
**기간**: 2-3일
**산출물**: 작동하는 프로토타입

---

### 단계 2: 검증 (1주일)

**활동**:
- [ ] 30-50개 이미지 테스트
- [ ] 정확도 데이터 수집
- [ ] 프롬프트 A/B 테스트
- [ ] 사용성 평가

**판단**:
- ✅ 정확도 > 80% → 단계 3 진행
- ⚠️ 정확도 70-80% → 프롬프트 개선
- ❌ 정확도 < 70% → 중단 또는 pivot

---

### 단계 3: 풀 버전 개발 (8주) - 조건부

**조건**: 단계 2에서 정확도 > 80%

**추가 기능**:
1. **Week 1-2**: 데이터베이스 + 인증
2. **Week 3-4**: 편집 기능 (속성 패널)
3. **Week 5-6**: 프로젝트 관리 + 저장
4. **Week 7-8**: 고급 기능 (드래그 앤 드롭)

**참고**: [기존 PRD.md 백업](./PRD_FULL.md.backup) - 풀 버전 명세

---

### 단계 4: 출시 (선택) - 조건부

**조건**: 단계 3 완료 + 사용자 피드백 긍정적

**활동**:
- [ ] 베타 테스트 (10-20명)
- [ ] 프로덕션 배포 (Vercel)
- [ ] 마케팅 (개발자 커뮤니티)
- [ ] 수익화 (크레딧 시스템)

---

## 📝 체크리스트 (시작 전)

### 준비물

- [ ] **개발 환경**
  - [ ] Node.js 18+ 설치됨
  - [ ] npm 또는 yarn 사용 가능
  - [ ] VS Code (또는 선호하는 에디터)

- [ ] **프로젝트 설정**
  - [ ] Next.js 16 프로젝트 존재
  - [ ] Tailwind CSS 설정됨
  - [ ] TypeScript 설정됨

- [ ] **API 키**
  - [ ] Gemini API 키 발급됨
  - [ ] `.env.local`에 `NEXT_PUBLIC_GEMINI_API_KEY` 설정

- [ ] **테스트 이미지**
  - [ ] 웹페이지 스크린샷 10개 준비
  - [ ] 다양한 레이아웃 (히어로, 피처, CTA)

### 시작 명령어

```bash
# 1. 의존성 설치
npm install @google/generative-ai

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저 열기
open http://localhost:3000/page-builder

# 4. 코드 작성 시작 (Day 1)
# - app/page-builder/page.tsx
# - app/api/analyze-image/route.ts
# - services/gemini/vision.ts
```

---

## 🎯 성공 정의

### 기술적 성공
- ✅ 이미지 업로드 → AI 분석 → 코드 생성 플로우 작동
- ✅ AI 정확도 > 80%
- ✅ 응답 시간 < 30초
- ✅ 에러율 < 5%

### 비즈니스 성공 (단계 4에서)
- ✅ 사용자 만족도 > 4/5
- ✅ Free → Pro 전환율 > 5%
- ✅ NPS > 40

### 개인 성공
- ✅ 2-3일 안에 작동하는 프로토타입
- ✅ AI 기술 학습 및 실험
- ✅ 프롬프트 엔지니어링 경험
- ✅ 풀 버전 개발 여부 명확한 판단

---

## 📚 참고 자료

### 기술 문서

- **Gemini Vision API**: https://ai.google.dev/tutorials/vision_quickstart
- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

### 유사 프로젝트

- **Screenshot to Code**: https://github.com/abi/screenshot-to-code
- **Figma to Code**: https://www.figma.com/community/plugin/842128343887142055
- **HTML to Figma**: https://html.to.design/

---

## 🔖 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 0.1 | 2025-11-12 | 초기 작성 (와이어프레임 MVP) |

---

## 📞 문의

**개발자**: 본인 (개인 프로젝트)
**목적**: 기술 검증 및 학습
**공유**: 선택 (성공 시 오픈소스 고려)

---

**© 2025 PageForge Wireframe MVP. Personal Project.**

---

## 부록 A: 전체 코드 스니펫

### 파일 1: `app/page-builder/page.tsx` (메인)

```typescript
'use client'

import { useState } from 'react'

export default function PageBuilderPage() {
  const [image, setImage] = useState<string | null>(null)
  const [schema, setSchema] = useState<any>(null)
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('이미지 크기는 2MB 이하여야 합니다')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!image) return

    setLoading(true)
    setError(null)

    try {
      // AI 분석
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
      })

      if (!res.ok) {
        throw new Error('AI 분석 실패')
      }

      const data = await res.json()
      setSchema(data.schema)

      // 코드 생성
      const codeRes = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema: data.schema })
      })

      if (!codeRes.ok) {
        throw new Error('코드 생성 실패')
      }

      const codeData = await codeRes.json()
      setCode(codeData.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류 발생')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert('코드가 복사되었습니다!')
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">
        PageForge - Wireframe MVP
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 1. 업로드 */}
      <section className="mb-8 border border-gray-300 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">[1] 이미지 업로드</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-4"
        />
        {image && (
          <img
            src={image}
            alt="Preview"
            className="max-w-md border rounded"
          />
        )}
        <button
          onClick={handleAnalyze}
          disabled={!image || loading}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 분석 중... (30초)' : 'AI 분석 시작'}
        </button>
      </section>

      {/* 2. JSON */}
      {schema && (
        <section className="mb-8 border border-gray-300 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">[2] AI 분석 결과 (JSON)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-64">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </section>
      )}

      {/* 3. 프리뷰 */}
      {schema && (
        <section className="mb-8 border border-gray-300 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">[3] 렌더링 프리뷰</h2>
          <div className="border border-gray-200 rounded overflow-auto">
            {schema.sections?.map((section: any, i: number) => (
              <div key={i} className={`${section.background || 'bg-white'} p-8`}>
                {section.components?.map((comp: any, j: number) => {
                  if (comp.type === 'heading') {
                    return (
                      <h1 key={j} className={comp.className || 'text-2xl font-bold'}>
                        {comp.content}
                      </h1>
                    )
                  } else if (comp.type === 'badge') {
                    return (
                      <span key={j} className={comp.className || 'inline-block bg-blue-100 px-3 py-1 rounded'}>
                        {comp.content}
                      </span>
                    )
                  } else if (comp.type === 'card') {
                    return (
                      <div key={j} className={comp.className || 'border p-4 rounded'}>
                        {comp.content}
                      </div>
                    )
                  } else {
                    return (
                      <div key={j} className={comp.className}>
                        {comp.content}
                      </div>
                    )
                  }
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 코드 */}
      {code && (
        <section className="mb-8 border border-gray-300 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">[4] 생성된 코드</h2>
          <textarea
            value={code}
            readOnly
            className="w-full h-64 font-mono text-sm border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handleCopy}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            코드 복사
          </button>
        </section>
      )}
    </div>
  )
}
```

### 파일 2: `services/gemini/vision.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function analyzeImage(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

  const prompt = `
웹페이지 스크린샷을 분석하여 JSON 형식으로 변환해주세요:

{
  "sections": [
    {
      "type": "hero | feature | testimonial | cta",
      "background": "bg-blue-600 (Tailwind 클래스)",
      "components": [
        {
          "type": "heading | badge | card | button | paragraph",
          "content": "텍스트 내용 (OCR)",
          "className": "text-4xl font-bold text-white (Tailwind 클래스)"
        }
      ]
    }
  ]
}

규칙:
1. 간단히 3-5개 주요 컴포넌트만 추출
2. 텍스트는 정확히 OCR
3. Tailwind CSS 클래스 사용
4. 섹션은 최대 3개까지만

JSON만 반환하세요 (다른 설명 없이).
`

  const image = {
    inlineData: {
      data: imageBase64.split(',')[1], // Base64에서 "data:image/png;base64," 제거
      mimeType: 'image/png'
    }
  }

  const result = await model.generateContent([prompt, image])
  const response = await result.response
  const text = response.text()

  // JSON 추출 (```json ... ``` 래핑 제거)
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1])
  }

  // 래핑 없으면 직접 파싱
  return JSON.parse(text)
}
```

### 파일 3: `app/api/analyze-image/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { analyzeImage } from '@/services/gemini/vision'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    const schema = await analyzeImage(image)

    return NextResponse.json({
      success: true,
      schema
    })
  } catch (error) {
    console.error('AI 분석 실패:', error)
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
```

### 파일 4: `services/code-generator.ts`

```typescript
interface PageSchema {
  sections: Section[]
}

interface Section {
  type: string
  background?: string
  components: Component[]
}

interface Component {
  type: string
  content: string
  className?: string
}

export function generateReactCode(schema: PageSchema): string {
  let code = 'export default function GeneratedPage() {\n  return (\n    <main>\n'

  schema.sections?.forEach((section, i) => {
    const bg = section.background || 'bg-white'
    code += `      <section className="${bg} p-8">\n`

    section.components?.forEach((comp, j) => {
      const className = comp.className || ''

      if (comp.type === 'heading') {
        code += `        <h1 className="${className}">\n`
        code += `          ${comp.content}\n`
        code += `        </h1>\n`
      } else if (comp.type === 'badge') {
        code += `        <span className="${className}">\n`
        code += `          ${comp.content}\n`
        code += `        </span>\n`
      } else if (comp.type === 'card') {
        code += `        <div className="${className}">\n`
        code += `          <p>${comp.content}</p>\n`
        code += `        </div>\n`
      } else if (comp.type === 'button') {
        code += `        <button className="${className}">\n`
        code += `          ${comp.content}\n`
        code += `        </button>\n`
      } else {
        code += `        <div className="${className}">\n`
        code += `          ${comp.content}\n`
        code += `        </div>\n`
      }
    })

    code += `      </section>\n`
  })

  code += '    </main>\n  )\n}'

  return code
}
```

### 파일 5: `app/api/generate-code/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { generateReactCode } from '@/services/code-generator'

export async function POST(request: Request) {
  try {
    const { schema } = await request.json()

    if (!schema) {
      return NextResponse.json(
        { error: 'Schema is required' },
        { status: 400 }
      )
    }

    const code = generateReactCode(schema)

    return NextResponse.json({
      success: true,
      code
    })
  } catch (error) {
    console.error('코드 생성 실패:', error)
    return NextResponse.json(
      { error: '코드 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
```

### 파일 6: `types/page-builder.ts`

```typescript
export interface PageSchema {
  sections: Section[]
}

export interface Section {
  type: 'hero' | 'feature' | 'testimonial' | 'cta'
  background?: string
  components: Component[]
}

export interface Component {
  type: 'heading' | 'badge' | 'card' | 'button' | 'paragraph'
  content: string
  className?: string
}
```

---

## 부록 B: 빠른 시작 가이드

### 1. 설치 (5분)

```bash
# 프로젝트 루트에서
cd /Users/a/Documents/Team-jane/detail

# 의존성 설치
npm install @google/generative-ai

# 환경 변수 확인
cat .env.local | grep GEMINI_API_KEY
# 없으면 추가: echo "NEXT_PUBLIC_GEMINI_API_KEY=your_key" >> .env.local
```

### 2. 파일 생성 (10분)

```bash
# 디렉토리 생성
mkdir -p app/page-builder
mkdir -p app/api/analyze-image
mkdir -p app/api/generate-code
mkdir -p services/gemini
mkdir -p types

# 파일 생성 (위 코드 복사)
# 1. app/page-builder/page.tsx
# 2. services/gemini/vision.ts
# 3. app/api/analyze-image/route.ts
# 4. services/code-generator.ts
# 5. app/api/generate-code/route.ts
# 6. types/page-builder.ts
```

### 3. 실행 (1분)

```bash
# 개발 서버 실행
npm run dev

# 브라우저 열기
open http://localhost:3000/page-builder
```

### 4. 테스트 (5분)

1. 웹페이지 스크린샷 준비
2. [파일 선택] 클릭 → 이미지 업로드
3. [AI 분석 시작] 클릭
4. 30초 대기
5. JSON, 프리뷰, 코드 확인
6. [코드 복사] 클릭

**총 소요 시간**: **20분** ✅

---

**문서 종료**
