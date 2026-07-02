/**
 * [파일 설명] 로케일 공통 유틸 (중첩 JSON 평면화, t 함수 생성).
 * 렌더러(t 함수)와 빌드 파이프라인(html 치환) 양쪽에서 쓰이므로
 * DOM/Node API 에 의존하지 않는다.
 */

export type LocaleDict = { [key: string]: string | LocaleDict }

/** 중첩 로케일 JSON 을 "a.b.c" → 문자열 평면 맵으로 변환 */
export function flattenLocale(dict: LocaleDict, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(dict)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      out[path] = value
    } else {
      Object.assign(out, flattenLocale(value, path))
    }
  }
  return out
}

/**
 * TS 코드에서 쓰는 동적 문자열용 t 함수 생성.
 * html 정적 텍스트는 빌드 시 치환되므로, 여기는 에러 메시지처럼
 * 상황에 따라 갈리는 문자열에만 쓰인다.
 * 없는 키는 즉시 던져서 언어팩 누락이 조용히 넘어가는 것을 막는다.
 */
export function createT(dict: LocaleDict): (key: string) => string {
  const flat = flattenLocale(dict)
  return (key) => {
    const text = flat[key]
    if (text === undefined) {
      throw new Error(`[i18n] 로케일에 없는 키: "${key}"`)
    }
    return text
  }
}
