import { NextResponse } from 'next/server'
import { analyzeImage } from '@/services/gemini/vision'

/**
 * POST /api/analyze-image
 *
 * 이미지를 Gemini Vision API로 분석하여 PageSchema JSON 반환
 *
 * Request Body:
 * {
 *   "image": "data:image/png;base64,..."
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "schema": { sections: [...] }
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { image } = body

    // 입력 검증
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { success: false, error: '이미지 데이터가 필요합니다' },
        { status: 400 }
      )
    }

    // Base64 형식 검증
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: '올바른 이미지 형식이 아닙니다 (data:image/... 형식 필요)' },
        { status: 400 }
      )
    }

    // Gemini Vision API 호출
    const schema = await analyzeImage(image)

    return NextResponse.json({
      success: true,
      schema,
    })
  } catch (error) {
    console.error('이미지 분석 API 오류:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '이미지 분석 중 오류가 발생했습니다',
      },
      { status: 500 }
    )
  }
}
