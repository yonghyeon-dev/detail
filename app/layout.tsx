import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 페이지 빌더',
  description: '이미지를 업로드하면 AI가 React 코드를 생성합니다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
