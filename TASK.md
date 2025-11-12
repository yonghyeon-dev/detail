# AI 페이지 빌더 구현 (2025-11-12)

## 📋 작업 개요

**목표**: 이미지를 업로드하면 AI가 분석하여 React 코드를 생성하는 와이어프레임 MVP 구현

**예상 총 시간**: 8-11시간 (2-3일)
**파일 수**: 6개
**코드 라인**: ~300줄

---

## 🎯 Phase 1: 타입 정의 (30분)

**목표**: 프로젝트 전체에서 사용할 TypeScript 타입 정의

### 체크리스트
- [ ] types/page-builder.ts 파일 생성
- [ ] PageSchema 인터페이스 정의
- [ ] Section 인터페이스 정의 (type, background, components)
- [ ] Component 인터페이스 정의 (type, content, className)
- [ ] export 확인
- [ ] npx tsc --noEmit 타입 체크

**파일**:
- `types/page-builder.ts` (신규 생성)

**변경 사항**:
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
  type: 'heading' | 'badge' | 'card' | 'button' | 'paragraph' | 'h1' | 'h2' | 'span' | 'div'
  content: string
  className?: string
}
```

---

## 🎯 Phase 2: Gemini Vision 통합 (1-2시간)

**목표**: 이미지를 Gemini Vision API로 전송하여 JSON 스키마 반환

### 체크리스트
- [ ] services/gemini/vision.ts 파일 생성
- [ ] @google/generative-ai import
- [ ] GoogleGenerativeAI 클라이언트 초기화
- [ ] analyzeImage() 함수 구현
- [ ] 프롬프트 작성 (핵심!)
- [ ] JSON 파싱 로직 (```json...``` 블록 추출)
- [ ] 에러 처리 추가
- [ ] 환경 변수 확인 (NEXT_PUBLIC_GEMINI_API_KEY)

**파일**:
- `services/gemini/vision.ts` (신규 생성)

**변경 사항**:
- Gemini Pro Vision 모델 사용
- Base64 이미지를 inlineData로 전송
- 프롬프트에 JSON 스키마 형식 명시
- PageSchema 타입으로 반환

**핵심 프롬프트 (초안)**:
```
다음 웹페이지 이미지를 분석하여 JSON 형식으로 변환해주세요:

{
  "sections": [
    {
      "type": "hero" | "feature" | "testimonial" | "cta",
      "background": "Tailwind CSS 클래스 (예: bg-blue-600)",
      "components": [
        {
          "type": "h1" | "h2" | "span" | "div" | "button",
          "content": "텍스트 내용",
          "className": "Tailwind CSS 클래스"
        }
      ]
    }
  ]
}

규칙:
- 레이아웃을 섹션 단위로 분리
- 각 요소의 스타일을 Tailwind CSS 클래스로 표현
- 텍스트 내용을 정확히 추출
```

---

## 🎯 Phase 3: 코드 생성기 (1시간)

**목표**: JSON 스키마를 React 컴포넌트 코드 문자열로 변환

### 체크리스트
- [ ] services/code-generator.ts 파일 생성
- [ ] generateReactCode() 함수 구현
- [ ] Section 순회 로직
- [ ] Component 타입별 태그 매핑
- [ ] className 속성 추가
- [ ] 들여쓰기 처리 (가독성)
- [ ] export default 감싸기
- [ ] 테스트 (샘플 JSON → 코드 변환)

**파일**:
- `services/code-generator.ts` (신규 생성)

**변경 사항**:
```typescript
export function generateReactCode(schema: PageSchema): string {
  let code = 'export default function Page() {\n  return (\n'

  schema.sections.forEach((section) => {
    code += `    <section className="${section.background} p-8">\n`
    section.components.forEach((comp) => {
      const tag = comp.type === 'heading' ? 'h1' : comp.type
      code += `      <${tag} className="${comp.className}">${comp.content}</${tag}>\n`
    })
    code += '    </section>\n'
  })

  code += '  )\n}'
  return code
}
```

---

## 🎯 Phase 4: API Routes (1시간)

**목표**: Next.js API Routes로 서비스 로직 래핑

### 체크리스트
- [ ] app/api/analyze-image/route.ts 생성
- [ ] POST 핸들러 구현
- [ ] Request body 파싱 ({ image: string })
- [ ] analyzeImage() 호출
- [ ] 에러 처리 (try-catch)
- [ ] Response 반환 ({ success, schema })
- [ ] app/api/generate-code/route.ts 생성
- [ ] POST 핸들러 구현
- [ ] Request body 파싱 ({ schema: PageSchema })
- [ ] generateReactCode() 호출
- [ ] Response 반환 ({ success, code })

**파일**:
- `app/api/analyze-image/route.ts` (신규 생성)
- `app/api/generate-code/route.ts` (신규 생성)

**변경 사항**:
- 간단한 래퍼 함수
- 에러 처리 필수
- JSON 응답 형식 통일

---

## 🎯 Phase 5: 메인 UI 페이지 (2-3시간)

**목표**: 사용자가 상호작용할 수 있는 단일 페이지 구현

### 체크리스트
- [ ] app/page-builder/page.tsx 생성
- [ ] 'use client' 지시문 추가
- [ ] State 선언 (image, schema, code, loading)
- [ ] **Section 1: 파일 업로드**
  - [ ] input type="file" 구현
  - [ ] 이미지 미리보기
  - [ ] Base64 변환
- [ ] **Section 2: JSON 표시**
  - [ ] schema state를 JSON.stringify로 표시
  - [ ] pre 태그 사용
- [ ] **Section 3: 시각적 프리뷰**
  - [ ] schema.sections 순회
  - [ ] 실제 HTML로 렌더링
  - [ ] Tailwind 클래스 적용
- [ ] **Section 4: 코드 표시**
  - [ ] textarea로 코드 표시
  - [ ] 복사 버튼 구현
- [ ] handleFileChange 구현
- [ ] handleAnalyze 구현 (API 호출)
- [ ] handleGenerate 구현 (API 호출)
- [ ] handleCopy 구현 (clipboard API)
- [ ] 로딩 상태 UI
- [ ] 에러 처리 UI

**파일**:
- `app/page-builder/page.tsx` (신규 생성)

**변경 사항**:
- 4개 섹션을 세로로 배치
- 최소 스타일 (Tailwind 기본 클래스만)
- 버튼 3개: "분석하기", "코드 생성", "복사"

---

## 🎯 Phase 6: 테스트 및 검증 (2-3시간)

**목표**: 실제 이미지로 테스트하여 AI 정확도 측정

### 체크리스트
- [ ] npm install @google/generative-ai 실행
- [ ] 환경 변수 설정 확인
- [ ] npm run dev 실행
- [ ] http://localhost:3000/page-builder 접속
- [ ] **샘플 이미지 10개 준비**
  - [ ] 1. 랜딩 페이지 (히어로 섹션)
  - [ ] 2. 카드 그리드 (3개)
  - [ ] 3. 리뷰 섹션 (별점 + 후기)
  - [ ] 4. CTA 버튼 영역
  - [ ] 5. 네비게이션 바
  - [ ] 6. 푸터
  - [ ] 7. 프라이싱 테이블
  - [ ] 8. FAQ 아코디언
  - [ ] 9. 팀 소개 (프로필 카드)
  - [ ] 10. 연락처 폼
- [ ] 각 이미지로 테스트 실행
- [ ] **정확도 기록**
  - [ ] 레이아웃 인식: X/10
  - [ ] 텍스트 추출: X/10
  - [ ] 스타일 변환: X/10
- [ ] 버그 발견 및 수정
- [ ] 프롬프트 최적화 (필요시)
- [ ] 최종 검증

**파일**:
- 모든 파일

**변경 사항**:
- 버그 수정
- 프롬프트 개선
- 에러 처리 강화

---

## 🎯 Phase 7: HTML 코드 생성 기능 추가 (1시간)

**목표**: React 코드 외에 순수 HTML 코드도 생성할 수 있도록 추가

### 체크리스트
- [x] services/code-generator.ts에 generateHTMLCode() 함수 추가
- [x] services/code-generator.ts에 generateHTMLComponentCode() 헬퍼 함수 추가
- [x] formatCode()에 빈 class="" 속성 제거 로직 추가
- [x] API endpoint에 format 파라미터 추가 (react/html)
- [x] UI에 코드 포맷 선택 라디오 버튼 추가
- [x] 생성 버튼 텍스트 동적 변경 (React/HTML)
- [x] 코드 섹션 제목 동적 변경
- [x] 빌드 테스트 완료

**파일**:
- `services/code-generator.ts` (수정)
- `app/api/generate-code/route.ts` (수정)
- `app/page-builder/page.tsx` (수정)

**변경 사항**:
```typescript
// generateHTMLCode() 추가
export function generateHTMLCode(schema: PageSchema): string {
  let html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 생성 페이지</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen">
`
  // ... sections and components with class instead of className
}

// API endpoint 수정
const { schema, format = 'react' } = body
const rawCode = format === 'html' ? generateHTMLCode(schema) : generateReactCode(schema)

// UI 수정
const [codeFormat, setCodeFormat] = useState<'react' | 'html'>('react')
// 라디오 버튼으로 포맷 선택
```

**실제 소요 시간**: ~30분

---

## 📝 작업 진행 상황

### Phase 1: 타입 정의
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 테스트 완료

### Phase 2: Gemini Vision 통합
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 테스트 완료

### Phase 3: 코드 생성기
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 테스트 완료

### Phase 4: API Routes
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 테스트 완료

### Phase 5: 메인 UI 페이지
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 테스트 완료

### Phase 6: 테스트 및 검증
- [ ] 시작
- [ ] 진행 중
- [ ] 완료
- [ ] 목표 정확도 달성 (>80%)

### Phase 7: HTML 코드 생성 기능 추가
- [x] 시작
- [x] 진행 중
- [x] 완료
- [x] 빌드 테스트 완료

---

## 🔍 테스트 체크리스트

### 기능 테스트
- [ ] 파일 업로드 동작
- [ ] 이미지 미리보기 표시
- [ ] AI 분석 API 호출 성공
- [ ] JSON 스키마 반환 정상
- [ ] 시각적 프리뷰 렌더링
- [ ] React 코드 생성 정상
- [ ] 코드 복사 기능 동작

### 에러 처리
- [ ] 파일 미선택 시 에러 메시지
- [ ] AI API 실패 시 에러 표시
- [ ] 네트워크 에러 처리
- [ ] 잘못된 JSON 형식 처리

### 성능
- [ ] 분석 시간: <10초
- [ ] 코드 생성 시간: <1초
- [ ] 로딩 상태 표시

---

## 📊 예상 소요 시간

| Phase | 예상 시간 | 실제 시간 | 상태 |
|-------|----------|----------|------|
| Phase 1: 타입 정의 | 30분 | 30분 | ✅ 완료 |
| Phase 2: Gemini Vision | 1-2시간 | 1.5시간 | ✅ 완료 |
| Phase 3: 코드 생성기 | 1시간 | 45분 | ✅ 완료 |
| Phase 4: API Routes | 1시간 | 40분 | ✅ 완료 |
| Phase 5: 메인 UI | 2-3시간 | 2시간 | ✅ 완료 |
| Phase 6: 테스트 | 2-3시간 | - | 🚧 대기 중 |
| Phase 7: HTML 생성 | 1시간 | 30분 | ✅ 완료 |
| **총계** | **8-11시간** | **~6시간** | **85% 완료** |

---

## 🎯 성공 기준

### 필수 (Must Have)
- ✅ 이미지 업로드 → JSON 변환 성공
- ✅ JSON → React 코드 생성 성공
- ✅ 생성된 코드가 실행 가능
- ✅ AI 정확도 >80% (10개 샘플 중 8개)

### 권장 (Nice to Have)
- 🎨 Syntax Highlighting (추가 가능)
- 📱 반응형 UI (나중에)
- 💾 세션 저장 (나중에)

---

## 📌 참고 사항

### 의존성
- `@google/generative-ai` - Gemini API SDK (필수 설치)

### 환경 변수
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 프롬프트 최적화 팁
1. 예시 JSON 제공
2. 규칙을 명확히 명시
3. Tailwind 클래스 가이드
4. Few-shot learning (2-3개 예시)

---

**작성일**: 2025-11-12
**최근 업데이트**: 2025-11-12
**다음 업데이트**: Phase 완료 시마다
