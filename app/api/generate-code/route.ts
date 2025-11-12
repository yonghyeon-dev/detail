import { NextResponse } from 'next/server'
import { generateReactCode, generateHTMLCode, formatCode } from '@/services/code-generator'
import type { PageSchema } from '@/types/page-builder'

/**
 * POST /api/generate-code
 *
 * PageSchema JSON을 React 또는 HTML 코드로 변환
 *
 * Request Body:
 * {
 *   "schema": { sections: [...] },
 *   "format": "react" | "html"  // 기본값: "react"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "code": "export default function Page() { ... }" | "<!DOCTYPE html>..."
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { schema, format = 'react' } = body as { schema: PageSchema; format?: 'react' | 'html' }

    // 입력 검증
    if (!schema || !schema.sections || !Array.isArray(schema.sections)) {
      return NextResponse.json(
        { success: false, error: '올바른 PageSchema 형식이 필요합니다' },
        { status: 400 }
      )
    }

    // 포맷 검증
    if (format !== 'react' && format !== 'html') {
      return NextResponse.json(
        { success: false, error: 'format은 "react" 또는 "html"이어야 합니다' },
        { status: 400 }
      )
    }

    // 포맷에 따라 코드 생성
    const rawCode = format === 'html' ? generateHTMLCode(schema) : generateReactCode(schema)
    const code = formatCode(rawCode)

    return NextResponse.json({
      success: true,
      code,
      format, // 어떤 포맷으로 생성되었는지 반환
    })
  } catch (error) {
    console.error('코드 생성 API 오류:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '코드 생성 중 오류가 발생했습니다',
      },
      { status: 500 }
    )
  }
}
