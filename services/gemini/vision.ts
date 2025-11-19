import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PageSchema } from '@/types/page-builder'

/**
 * 재시도 로직 헬퍼 함수 (Exponential Backoff)
 *
 * @param fn - 실행할 비동기 함수
 * @param maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @param initialDelay - 초기 대기 시간 (밀리초, 기본값: 1000ms)
 * @returns 함수 실행 결과
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // 503 에러 또는 "overloaded" 메시지가 포함된 경우에만 재시도
      const is503Error =
        error.message?.includes('503') ||
        error.message?.includes('overloaded') ||
        error.message?.includes('Service Unavailable')

      if (is503Error && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt)
        console.log(
          `⚠️ Gemini API 과부하 감지. 재시도 ${attempt + 1}/${maxRetries}, ${delay}ms 대기...`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // 503이 아닌 다른 에러이거나 최대 재시도 횟수 도달 시 즉시 throw
      throw error
    }
  }

  throw lastError!
}

/**
 * Gemini Vision API를 사용하여 이미지를 분석하고 PageSchema JSON 반환
 *
 * @param imageBase64 - Base64 인코딩된 이미지 (data:image/png;base64,...)
 * @returns PageSchema JSON 객체
 */
export async function analyzeImage(imageBase64: string): Promise<PageSchema> {
  // 환경 변수에서 API 키 가져오기
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다')
  }

  // Gemini API 클라이언트 초기화
  const genAI = new GoogleGenerativeAI(apiKey)
  // gemini-2.5-flash: 최신 모델, 빠르고 정확하며 멀티모달 지원
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // Base64 데이터에서 MIME 타입과 데이터 분리
  const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    throw new Error('잘못된 Base64 이미지 형식입니다')
  }

  const mimeType = matches[1]
  const base64Data = matches[2]

  // 프롬프트: 웹페이지 이미지를 PageSchema JSON으로 변환
  const prompt = `
다음 웹페이지 스크린샷을 분석하여 React 컴포넌트를 생성할 수 있는 JSON 형식으로 변환해주세요.

⚠️ 중요: 현재 화면(viewport)에 실제로 보이는 부분만 분석하세요. 스크롤해야 보이는 내용이나 화면 밖의 요소는 포함하지 마세요.

JSON 스키마:
\`\`\`json
{
  "sections": [
    {
      "type": "hero" | "feature" | "testimonial" | "cta" | "navigation" | "footer" | "pricing" | "faq" | "team" | "contact",
      "background": "Tailwind CSS 배경 + 높이 클래스 (예: bg-blue-600 min-h-screen, bg-gray-100 min-h-[60vh] py-16)",
      "components": [
        {
          "type": "h1" | "h2" | "h3" | "p" | "span" | "button" | "a" | "badge" | "card" | "div",
          "content": "실제 텍스트 내용 (보이는 부분만)",
          "className": "Tailwind CSS 클래스 (레이아웃 + 스타일)"
        }
      ]
    }
  ]
}
\`\`\`

분석 규칙:

1. **viewport 기반 분석** (가장 중요!)
   - 현재 화면에 보이는 부분만 추출
   - 요소가 잘려 있으면 보이는 부분까지만 포함
   - 예: 카드의 일부만 보이면 보이는 텍스트만 추출

2. **섹션 분리 및 높이**
   - 각 섹션의 상대적 크기를 정확히 파악
   - 전체 화면: min-h-screen
   - 화면의 70%: min-h-[70vh]
   - 화면의 50%: min-h-[50vh]
   - 고정 높이: h-64 (작은 섹션)

3. **레이아웃 구조**
   - 섹션 내부 정렬: flex flex-col items-center justify-center
   - padding: py-16 px-8 (섹션), p-6 (카드)
   - 요소 간 간격: space-y-6, gap-4, mb-4
   - 최대 너비: max-w-4xl mx-auto

4. **텍스트 추출** (매우 중요!)
   - 화면에 보이는 텍스트만 정확히 추출
   - **작고 흐릿한 텍스트도 최대한 추출하세요**
   - **배지, 제목, 부제목, 소제목, 본문 텍스트 - 모든 텍스트 요소 빠짐없이 추출**
   - 잘린 텍스트는 보이는 부분까지만
   - 줄바꿈 그대로 유지
   - **중요: content 필드는 절대 비워두지 마세요**
   - **카드나 요소가 일부만 보이더라도 내부 텍스트는 반드시 추출**
   - **텍스트가 전혀 안 보이면 요소 설명 사용** (예: "리뷰 카드", "사용자 후기")

5. **별점 및 이모지 추출** (매우 중요!)
   - 별점(⭐, ★), 하트(♥, ❤️) 등 모든 이모지를 정확히 추출
   - 별점은 개수를 그대로 유지 (예: ⭐⭐⭐⭐⭐ = 5개 별)
   - 이모지는 텍스트 content에 포함하여 자연스럽게 표시
   - 리뷰 카드의 경우: 사용자 이름 + 별점 + 리뷰 내용을 모두 포함

6. **스타일 변환**
   - 배경: bg-blue-600, bg-gradient-to-b from-blue-600 to-blue-700
   - 텍스트: text-5xl font-bold text-white leading-tight
   - 그림자: shadow-lg, shadow-xl
   - 둥근 모서리: rounded-lg, rounded-2xl
   - 투명도: bg-white/20, bg-black/50

7. **컴포넌트 타입**
   - 제목: h1 (메인), h2 (서브), h3 (소제목)
   - 본문: p (단락), span (인라인)
   - 버튼: button
   - 배지: badge (작은 라벨)
   - 카드: card (내용 그룹)

예시 1 (히어로 섹션 + 일부 보이는 카드):
\`\`\`json
{
  "sections": [
    {
      "type": "hero",
      "background": "bg-blue-600 min-h-[70vh] flex items-center justify-center",
      "components": [
        {
          "type": "badge",
          "content": "#100%신뢰지급 #후기이벤트",
          "className": "bg-black text-white px-4 py-2 rounded-full text-sm mb-6"
        },
        {
          "type": "h1",
          "content": "들러주세요",
          "className": "text-5xl font-bold text-white mb-2 text-center"
        },
        {
          "type": "h2",
          "content": "당신의 여행기",
          "className": "text-4xl font-bold text-white text-center"
        }
      ]
    },
    {
      "type": "testimonial",
      "background": "bg-gray-50 min-h-[30vh]",
      "components": [
        {
          "type": "card",
          "content": "DOORA*** ⭐⭐⭐⭐⭐\n\n유럽시간에 맞춰 24시간 카톡 케어 등... 또 유럽을 간다면 다시 함께하고 싶은 여행사입니다♥",  // ← 별점과 이모지 포함!
          "className": "bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto -mt-8"
        }
      ]
    }
  ]
}
\`\`\`

예시 2 (전체 화면 히어로):
\`\`\`json
{
  "sections": [
    {
      "type": "hero",
      "background": "bg-gradient-to-b from-purple-600 to-blue-600 min-h-screen flex flex-col items-center justify-center",
      "components": [
        {
          "type": "h1",
          "content": "Welcome to Our Service",
          "className": "text-6xl font-bold text-white mb-4 text-center"
        },
        {
          "type": "p",
          "content": "The best solution for your business",
          "className": "text-xl text-white/90 mb-8 text-center"
        },
        {
          "type": "button",
          "content": "Get Started",
          "className": "bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
        }
      ]
    }
  ]
}
\`\`\`

중요 체크리스트:
✅ 화면에 보이는 부분만 추출
✅ 섹션 높이 클래스 포함 (min-h-[X]vh)
✅ 레이아웃 클래스 포함 (flex, items-center 등)
✅ 정확한 텍스트 추출
✅ **작고 흐릿한 텍스트도 추출**
✅ **별점(⭐)과 이모지(♥) 정확히 추출**
✅ **모든 content 필드 반드시 채우기 (절대 비우지 않기)**
✅ 적절한 padding/margin

반드시 올바른 JSON 형식으로만 응답하세요. 설명이나 다른 텍스트는 포함하지 마세요.
`

  try {
    // Gemini Vision API 호출 (재시도 로직 포함)
    const schema = await retryWithBackoff(async () => {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ])

      const response = result.response
      const text = response.text()

      // JSON 블록 추출 (```json...``` 형식)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
      const jsonText = jsonMatch ? jsonMatch[1] : text

      // JSON 파싱
      return JSON.parse(jsonText) as PageSchema
    }, 3, 1000) // 최대 3회 재시도, 1초부터 시작 (1s → 2s → 4s)

    return schema
  } catch (error) {
    console.error('Gemini Vision API 오류:', error)
    throw new Error(
      `이미지 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    )
  }
}
