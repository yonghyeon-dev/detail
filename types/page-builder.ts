/**
 * AI 페이지 빌더 타입 정의
 *
 * Gemini Vision API가 반환하는 JSON 스키마와
 * React 코드 생성에 사용되는 타입들
 */

/**
 * 페이지 전체 스키마
 */
export interface PageSchema {
  sections: Section[]
}

/**
 * 페이지 섹션 (히어로, 기능, 후기, CTA 등)
 */
export interface Section {
  /** 섹션 타입 */
  type: 'hero' | 'feature' | 'testimonial' | 'cta' | 'navigation' | 'footer' | 'pricing' | 'faq' | 'team' | 'contact'

  /** 배경 스타일 (Tailwind CSS 클래스) */
  background?: string

  /** 섹션 내 컴포넌트 목록 */
  components: Component[]
}

/**
 * UI 컴포넌트 (텍스트, 버튼, 카드 등)
 */
export interface Component {
  /** 컴포넌트 타입 (HTML 태그 또는 의미론적 타입) */
  type:
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'  // 제목
    | 'p' | 'span' | 'div'                      // 텍스트
    | 'button' | 'a'                            // 인터랙티브
    | 'img'                                     // 이미지
    | 'card' | 'badge'                          // 의미론적
    | 'ul' | 'ol' | 'li'                        // 리스트
    | 'heading' | 'paragraph'                   // 별칭

  /** 텍스트 내용 또는 alt 텍스트 */
  content: string

  /** 스타일 (Tailwind CSS 클래스) */
  className?: string

  /** 링크 URL (a 태그용) */
  href?: string

  /** 이미지 소스 (img 태그용) */
  src?: string
}
