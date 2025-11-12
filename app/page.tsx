export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">AI 페이지 빌더</h1>
      <p className="text-lg text-gray-600 mb-8">
        이미지를 업로드하면 AI가 React 코드를 생성합니다
      </p>
      <a
        href="/page-builder"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        시작하기 →
      </a>
    </main>
  )
}
