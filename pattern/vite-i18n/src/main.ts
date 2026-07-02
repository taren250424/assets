/**
 * [파일 설명] 동적 문자열에서 t 함수를 쓰는 예시.
 * html 의 정적 텍스트는 이미 빌드타임에 치환되어 있으므로,
 * 여기서는 입력값에 따라 갈리는 문자열에만 t 를 쓴다.
 * @locale 은 vite.config.ts 의 alias — 빌드에 쓰인 것과 같은 언어 json 이 들어온다.
 */
import locale from '@locale'
import { createT } from './i18n'

const t = createT(locale)

const form = document.getElementById('greet-form') as HTMLFormElement
const input = document.getElementById('name-input') as HTMLInputElement
const msg = document.getElementById('msg') as HTMLParagraphElement

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = input.value.trim()
  msg.textContent = name ? `${t('app.hello')} ${name}` : t('app.emptyName')
})
