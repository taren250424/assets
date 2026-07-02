# vite-i18n

html 에 `{{t:키.경로}}` / `{{brand}}` 플레이스홀더를 쓰고, Vite 가 **빌드타임**에
선택된 언어·브랜드 텍스트로 치환하는 패턴. 산출물 html 에는 텍스트가 정적으로
박혀 나오므로 런타임 i18n 라이브러리·비용이 전혀 없다.

## 파일 구성

```
index.html          {{t:...}} / {{brand}} 를 그대로 쓰는 마크업
locales/ko.json     언어팩 (중첩 json, 새 언어 = 파일 추가)
locales/en.json
src/i18n.ts         flattenLocale(중첩 json → "a.b.c" 평면 맵) + createT(동적 문자열용 t 함수)
src/pipeline.ts     applyHtmlPlaceholders — html 문자열 치환 순수 함수 (+ HTML 이스케이프)
vite.config.ts      APP_LANG/APP_BRAND 로 로케일을 고르고 transformIndexHtml 훅으로 치환
src/main.ts         코드에서 동적 문자열에 t('키') 를 쓰는 예시
```

## 동작 흐름

1. `vite.config.ts` 가 `APP_LANG`(기본 ko) / `APP_BRAND`(기본 MyBrand) 환경변수를 읽어
   `locales/<lang>.json` 을 로드한다. 없는 언어면 이 시점에 바로 실패.
2. 커스텀 플러그인의 `transformIndexHtml` 훅이 html 의 `{{t:키}}` 를 로케일 텍스트로,
   `{{brand}}` 를 브랜드명으로 치환한다. 이 훅은 **dev 서버에서도 동작**하므로
   `npm run dev` 와 `npm run build` 가 완전히 같은 경로를 탄다.
3. 코드에서 필요한 동적 문자열(에러 메시지 등)은 `@locale` alias 로
   빌드에 쓰인 것과 같은 언어 json 을 import 해 `createT` 로 만든 `t('키')` 를 호출한다.

## 사용법

```sh
npm install
npm run dev        # 한국어(기본)로 dev 서버
npm run dev:en     # 영어로 dev 서버
npm run build      # dist/ 에 한국어 산출물
npm run build:en   # dist/ 에 영어 산출물
```

언어·브랜드는 환경변수로 자유롭게 조합할 수 있다 (스크립트는 예시일 뿐):

```sh
npx cross-env APP_LANG=en APP_BRAND=OtherBrand vite build
```

## 규칙과 특징

- **없는 키는 빌드 실패.** html 에서 쓴 키가 로케일에 없으면 치환 시점에 throw 되어
  언어팩 누락이 조용히 출시되는 일이 없다. 코드 쪽 `t()` 도 마찬가지로 즉시 throw.
- **HTML 이스케이프 내장.** 로케일 텍스트의 `& < > "` 는 치환 시 이스케이프되므로
  번역 문자열이 마크업으로 해석될 걱정이 없다.
- **속성에도 쓸 수 있다.** `<html lang>`, `<title>`, `placeholder` 등 문자열이 들어가는
  곳이면 어디든 `{{t:...}}` 가능 — 단순 문자열 치환이기 때문.
- **언어 추가 = json 추가.** `locales/xx.json` 을 만들고 `APP_LANG=xx` 로 빌드하면 끝.
- **다국어 배포는 언어별 빌드.** 치환이 빌드타임이므로 언어마다 산출물을 따로 만든다
  (`build` 스크립트를 언어 수만큼 돌리거나 반복 스크립트로 감싼다).
  런타임 언어 전환이 필요한 앱이라면 이 패턴 대신 런타임 i18n 을 써야 한다.
- `src/pipeline.ts` 와 `src/i18n.ts` 는 Node/DOM API 에 의존하지 않는 순수 함수라
  vitest 등으로 그대로 단위 테스트할 수 있다.
