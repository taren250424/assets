/**
 * [파일 설명] 빌드타임 html 플레이스홀더 치환 순수 함수.
 * vite.config.ts(빌드)에서 import 하며, 테스트에서도 그대로 쓸 수 있도록
 * Node/DOM API 에 의존하지 않는다.
 */

/**
 * html 안의 {{t:key.path}} 플레이스홀더를 로케일 텍스트로, {{brand}} 를 브랜드명으로 치환.
 * 없는 키는 빌드를 실패시켜 언어팩 누락이 조용히 출시되는 것을 막는다.
 */
export function applyHtmlPlaceholders(
  html: string,
  flat: Record<string, string>,
  brandName: string
): string {
  const replaced = html.replace(/\{\{t:([\w.-]+)\}\}/g, (_, key: string) => {
    const text = flat[key]
    if (text === undefined) {
      throw new Error(`[i18n] 로케일에 없는 키가 html 에서 사용됨: "${key}"`)
    }
    return escapeHtml(text)
  })
  return replaced.replace(/\{\{brand\}\}/g, escapeHtml(brandName))
}

/** 로케일 텍스트가 마크업으로 해석되지 않도록 이스케이프 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
