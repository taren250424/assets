/**
 * [파일 설명] 언어/브랜드를 html 에 굽는 커스텀 Vite 플러그인 설정.
 * APP_LANG / APP_BRAND 환경변수로 언어·브랜드를 정하고,
 * transformIndexHtml 훅으로 {{t:...}} / {{brand}} 를 빌드타임에 치환한다.
 * transformIndexHtml 은 dev 서버에서도 동작하므로 dev/build 가 같은 경로를 탄다.
 * 결과적으로 산출물 html 에는 텍스트가 정적으로 박혀 런타임 i18n 비용이 없다.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { flattenLocale, type LocaleDict } from './src/i18n'
import { applyHtmlPlaceholders } from './src/pipeline'

const lang = process.env.APP_LANG ?? 'ko'
const brand = process.env.APP_BRAND ?? 'MyBrand'

// 선택된 언어의 로케일 json. 없는 언어면 여기서 바로 실패한다.
const localePath = fileURLToPath(new URL(`./locales/${lang}.json`, import.meta.url))
const locale = JSON.parse(readFileSync(localePath, 'utf-8')) as LocaleDict

/** html 의 {{t:...}} / {{brand}} 플레이스홀더를 빌드타임에 치환하는 플러그인 */
function i18nPlugin(dict: LocaleDict, brandName: string): Plugin {
  const flat = flattenLocale(dict)
  return {
    name: 'i18n-placeholder',
    transformIndexHtml(html) {
      return applyHtmlPlaceholders(html, flat, brandName)
    }
  }
}

export default defineConfig({
  resolve: {
    // 코드(동적 문자열)에서도 같은 언어를 쓰도록 선택된 로케일 json 을 alias 로 고정
    alias: { '@locale': localePath }
  },
  plugins: [i18nPlugin(locale, brand)]
})
