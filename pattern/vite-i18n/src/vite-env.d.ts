/// <reference types="vite/client" />

// vite.config.ts 의 alias 로 고정되는 "현재 언어" 로케일 json
declare module '@locale' {
  const dict: import('./i18n').LocaleDict
  export default dict
}
