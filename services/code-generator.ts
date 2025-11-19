import type { PageSchema, Component } from '@/types/page-builder'

/**
 * PageSchema JSON을 React 컴포넌트 코드 문자열로 변환
 *
 * @param schema - analyzeImage()에서 반환된 PageSchema
 * @returns React 컴포넌트 코드 문자열
 */
export function generateReactCode(schema: PageSchema): string {
  let code = '// AI가 생성한 React 컴포넌트\n\n'
  code += 'export default function Page() {\n'
  code += '  return (\n'
  code += '    <div className="min-h-screen">\n'

  // 각 섹션을 순회하며 코드 생성
  schema.sections.forEach((section, sectionIndex) => {
    // background에 이미 레이아웃 클래스가 포함될 수 있으므로 그대로 사용
    const sectionClasses = section.background || ''

    code += `      {/* Section ${sectionIndex + 1}: ${section.type} */}\n`
    code += `      <section className="${sectionClasses}">\n`

    // 섹션 내 컴포넌트를 순회하며 코드 생성
    section.components.forEach((component) => {
      code += generateComponentCode(component, 8) // 들여쓰기 8칸
    })

    code += '      </section>\n\n'
  })

  code += '    </div>\n'
  code += '  )\n'
  code += '}\n'

  return code
}

/**
 * 개별 컴포넌트를 HTML 태그로 변환
 *
 * @param component - Component 객체
 * @param indent - 들여쓰기 칸 수
 * @returns HTML 태그 문자열
 */
function generateComponentCode(component: Component, indent: number): string {
  const spaces = ' '.repeat(indent)
  const tag = getHtmlTag(component.type)
  const className = component.className || ''
  const content = component.content || ''

  // 자식 콘텐츠가 없는 태그 (img 등)
  if (tag === 'img') {
    return `${spaces}<img src="${component.src || ''}" alt="${content}" className="${className}" />\n`
  }

  // 링크 태그
  if (tag === 'a') {
    return `${spaces}<a href="${component.href || '#'}" className="${className}">\n${spaces}  ${content}\n${spaces}</a>\n`
  }

  // 일반 태그
  return `${spaces}<${tag} className="${className}">\n${spaces}  ${content}\n${spaces}</${tag}>\n`
}

/**
 * Component 타입을 HTML 태그로 매핑
 *
 * @param type - Component.type
 * @returns HTML 태그 이름
 */
function getHtmlTag(type: Component['type']): string {
  // 의미론적 타입 → HTML 태그 매핑
  const typeMap: Record<string, string> = {
    heading: 'h1',
    paragraph: 'p',
    badge: 'span',
    card: 'div',
  }

  return typeMap[type] || type
}

/**
 * PageSchema JSON을 HTML 코드 문자열로 변환
 *
 * @param schema - analyzeImage()에서 반환된 PageSchema
 * @returns HTML 문서 코드 문자열
 */
export function generateHTMLCode(schema: PageSchema): string {
  let html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 생성 페이지</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen">
`

  // 각 섹션을 순회하며 HTML 생성
  schema.sections.forEach((section, sectionIndex) => {
    // background에 이미 레이아웃 클래스가 포함될 수 있으므로 그대로 사용
    const sectionClasses = section.background || ''

    html += `    <!-- Section ${sectionIndex + 1}: ${section.type} -->\n`
    html += `    <section class="${sectionClasses}">\n`

    // 섹션 내 컴포넌트를 순회하며 HTML 생성
    section.components.forEach((component) => {
      html += generateHTMLComponentCode(component, 6) // 들여쓰기 6칸
    })

    html += '    </section>\n\n'
  })

  html += `  </div>
</body>
</html>`

  return html
}

/**
 * 개별 컴포넌트를 순수 HTML 태그로 변환 (className → class)
 *
 * @param component - Component 객체
 * @param indent - 들여쓰기 칸 수
 * @returns HTML 태그 문자열
 */
function generateHTMLComponentCode(component: Component, indent: number): string {
  const spaces = ' '.repeat(indent)
  const tag = getHtmlTag(component.type)
  const classAttr = component.className ? ` class="${component.className}"` : ''
  const content = component.content || ''

  // 자식 콘텐츠가 없는 태그 (img 등)
  if (tag === 'img') {
    return `${spaces}<img src="${component.src || ''}" alt="${content}"${classAttr}>\n`
  }

  // 링크 태그
  if (tag === 'a') {
    return `${spaces}<a href="${component.href || '#'}"${classAttr}>${content}</a>\n`
  }

  // 일반 태그
  return `${spaces}<${tag}${classAttr}>${content}</${tag}>\n`
}

/**
 * 코드에서 중복 공백을 제거하고 포맷팅 정리
 *
 * @param code - 생성된 코드
 * @returns 정리된 코드
 */
export function formatCode(code: string): string {
  return code
    .replace(/\n{3,}/g, '\n\n') // 3개 이상 연속 줄바꿈 → 2개로
    .replace(/className=""/g, '') // 빈 className 제거
    .replace(/class=""/g, '') // 빈 class 제거
    .trim()
}
