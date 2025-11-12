'use client'

import React, { useState } from 'react'
import type { PageSchema } from '@/types/page-builder'

export default function PageBuilderPage() {
  // State 관리
  const [image, setImage] = useState<string | null>(null)
  const [schema, setSchema] = useState<PageSchema | null>(null)
  const [code, setCode] = useState<string>('')
  const [codeFormat, setCodeFormat] = useState<'react' | 'html'>('react')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 파일 선택 핸들러: 이미지를 Base64로 변환
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
      setError(null)
      // 새 이미지 선택 시 기존 결과 초기화
      setSchema(null)
      setCode('')
    }
    reader.onerror = () => {
      setError('파일 읽기 실패')
    }
    reader.readAsDataURL(file)
  }

  /**
   * AI 분석 핸들러: Gemini Vision API 호출
   */
  const handleAnalyze = async () => {
    if (!image) {
      setError('먼저 이미지를 업로드해주세요')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '이미지 분석 실패')
      }

      setSchema(data.schema)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 분석 중 오류 발생')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 코드 생성 핸들러: PageSchema → React/HTML 코드
   */
  const handleGenerate = async () => {
    if (!schema) {
      setError('먼저 이미지를 분석해주세요')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema, format: codeFormat }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '코드 생성 실패')
      }

      setCode(data.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : '코드 생성 중 오류 발생')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 코드 복사 핸들러: Clipboard API 사용
   */
  const handleCopy = () => {
    if (!code) return

    navigator.clipboard.writeText(code)
      .then(() => alert('코드가 클립보드에 복사되었습니다!'))
      .catch(() => setError('복사 실패'))
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI 페이지 빌더
          </h1>
          <p className="text-gray-600">
            웹페이지 스크린샷을 업로드하면 AI가 React 코드를 생성합니다
          </p>
        </header>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Section 1: 이미지 업로드 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1️⃣ 이미지 업로드
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />

          {image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">미리보기:</p>
              <img
                src={image}
                alt="업로드된 이미지"
                className="max-w-full h-auto rounded border border-gray-200"
                style={{ maxHeight: '400px' }}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold
                  hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                  transition"
              >
                {loading ? '분석 중...' : '🔍 AI로 분석하기'}
              </button>
            </div>
          )}
        </section>

        {/* Section 2: JSON 스키마 표시 */}
        {schema && (
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2️⃣ JSON 스키마
            </h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </section>
        )}

        {/* Section 3: 시각적 프리뷰 */}
        {schema && (
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3️⃣ 시각적 프리뷰
            </h2>
            <div className="border border-gray-300 rounded overflow-hidden">
              {schema.sections.map((section, sectionIndex) => (
                <section
                  key={sectionIndex}
                  className={`${section.background || ''} p-8`}
                >
                  {section.components.map((comp, compIndex) => {
                    const Tag = getComponentTag(comp.type) as any
                    return (
                      <Tag
                        key={compIndex}
                        className={comp.className || ''}
                        {...(comp.href ? { href: comp.href } : {})}
                        {...(comp.src ? { src: comp.src, alt: comp.content } : {})}
                      >
                        {!comp.src && comp.content}
                      </Tag>
                    )
                  })}
                </section>
              ))}
            </div>

            {/* 코드 포맷 선택 */}
            <div className="mt-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">코드 포맷 선택:</p>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="codeFormat"
                    value="react"
                    checked={codeFormat === 'react'}
                    onChange={(e) => setCodeFormat(e.target.value as 'react' | 'html')}
                    className="mr-2"
                  />
                  <span className="text-sm">React 컴포넌트</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="codeFormat"
                    value="html"
                    checked={codeFormat === 'html'}
                    onChange={(e) => setCodeFormat(e.target.value as 'react' | 'html')}
                    className="mr-2"
                  />
                  <span className="text-sm">HTML 문서</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold
                hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                transition"
            >
              {loading ? '생성 중...' : `💻 ${codeFormat === 'react' ? 'React' : 'HTML'} 코드 생성하기`}
            </button>
          </section>
        )}

        {/* Section 4: 생성된 코드 표시 */}
        {code && (
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4️⃣ 생성된 {codeFormat === 'react' ? 'React' : 'HTML'} 코드
            </h2>
            <textarea
              value={code}
              readOnly
              className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded
                border border-gray-700 resize-none"
            />
            <button
              onClick={handleCopy}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold
                hover:bg-purple-700 transition"
            >
              📋 코드 복사하기
            </button>
          </section>
        )}
      </div>
    </main>
  )
}

/**
 * Component 타입을 React 태그로 변환
 */
function getComponentTag(type: string): string {
  const typeMap: Record<string, string> = {
    heading: 'h1',
    paragraph: 'p',
    badge: 'span',
    card: 'div',
  }

  return typeMap[type] || type
}
