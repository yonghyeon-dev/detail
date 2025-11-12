import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PageSchema } from '@/types/page-builder'

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

JSON 스키마:
\`\`\`json
{
  "sections": [
    {
      "type": "hero" | "feature" | "testimonial" | "cta" | "navigation" | "footer" | "pricing" | "faq" | "team" | "contact",
      "background": "Tailwind CSS 배경 클래스 (예: bg-blue-600, bg-gradient-to-r from-blue-500 to-purple-600)",
      "components": [
        {
          "type": "h1" | "h2" | "h3" | "p" | "span" | "button" | "a" | "badge" | "card" | "div",
          "content": "실제 텍스트 내용",
          "className": "Tailwind CSS 클래스 (예: text-4xl font-bold text-white mb-4)"
        }
      ]
    }
  ]
}
\`\`\`

분석 규칙:
1. **섹션 분리**: 화면을 의미 있는 섹션으로 나누세요 (히어로, 기능, 후기 등)
2. **텍스트 추출**: 이미지 내 모든 텍스트를 정확히 추출하세요
3. **스타일 변환**: 색상, 크기, 간격 등을 Tailwind CSS 클래스로 표현하세요
   - 배경색: bg-blue-600, bg-gray-100 등
   - 텍스트 크기: text-4xl, text-lg 등
   - 폰트 굵기: font-bold, font-semibold 등
   - 간격: mb-4, p-8, space-y-4 등
   - 텍스트 색상: text-white, text-gray-900 등
4. **컴포넌트 타입**: 적절한 HTML 태그를 선택하세요
   - 제목: h1, h2, h3
   - 본문: p, span
   - 버튼: button
   - 링크: a
   - 장식: badge
   - 카드: card (div로 렌더링됨)

예시:
\`\`\`json
{
  "sections": [
    {
      "type": "hero",
      "background": "bg-blue-600",
      "components": [
        {
          "type": "badge",
          "content": "#ThisisBlank FEATURED",
          "className": "inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm mb-4"
        },
        {
          "type": "h1",
          "content": "들려주세요 당신의 여행기",
          "className": "text-5xl font-bold text-white mb-2"
        },
        {
          "type": "h2",
          "content": "독립주세요",
          "className": "text-3xl font-bold text-white"
        }
      ]
    }
  ]
}
\`\`\`

중요: 반드시 올바른 JSON 형식으로만 응답하세요. 설명이나 다른 텍스트는 포함하지 마세요.
`

  try {
    // Gemini Vision API 호출
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
    const schema: PageSchema = JSON.parse(jsonText)

    return schema
  } catch (error) {
    console.error('Gemini Vision API 오류:', error)
    throw new Error(
      `이미지 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    )
  }
}
