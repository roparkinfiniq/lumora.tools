# lumora.tools — Claude Code 작업 규칙

래원(Park Ra One)의 개인 사이트. 주소 **https://www.lumora.tools** (`lumora.tools`는 www로 넘어감).
작업을 부탁받으면 **이 파일을 먼저 지키고**, 도구 화면을 만들거나 고칠 때는 `TOOL_GUIDELINES.md`(디자인 · 새 도구 만드는 법)도 같이 본다.
대화와 설명은 **한국어**, 사이트 화면 글은 **영어** (아래 "언어").

## 1. 사이트가 무엇인가 (판단 기준)

| 부분 | 내용 | 주소 |
| --- | --- | --- |
| **도구 (중심)** | 브라우저에서 바로 도는 무료 도구 15개 (PDF 만들기 · 합치기 · 변환, 이미지 변환 · 압축, HEIC, ICO, JSON, Markdown, 그라디언트, 색 추출, 바코드, 사이즈 변환, 운동 캔버스). 파일을 서버에 올리지 않는다 | `/utilities`, `/utilities/{slug}` |
| **앱** | **두쿠아리움**(할 일로 키우는 네온 어항, 안드로이드 · 아이폰) → **Code Tiara**(집중용 할 일 앱, Mac · Windows) 순서. 두쿠아리움 페이지는 **앱의 공식 홈페이지**(인스타 프로필 링크 · 스토어 웹사이트 칸에 쓰는 곳, 한 · 영) | `/doquarium(/ko)`, `/code-tiara` |
| **저널** | 쉼 · 고요함 · 종이 노트 · AI에 대한 개인 에세이 | `/journal`, `/journal/{id}` |
| **소개** | "Less friction, More focus" 만드는 사람 | `/about` |
| **두쿠아리움 문서** | 개인정보처리방침 · 계정 삭제 안내 (한 · 영) | `/doquarium/privacy(/ko)`, `/doquarium/delete-account(/ko)` |
| **베타 테스터 모집** (잠시) | 안드로이드 비공개 테스트 참여 방법 (한 · 영) | `/doquarium/beta(/ko)` |

- 사이트가 **"물고기 앱 사이트"는 아니다**. 홈 · 공통 문구는 "브라우저에서 도는 무료 도구 모음 + 래원의 앱 · 글"로 쓴다 (래원 2026-10-18)
- **두쿠아리움이 맨 앞** (래원 결정 2026-10-10): 위 메뉴 첫 칸(청록 + 물고기 아이콘), 홈 카드는 Code Tiara 위, 도구 목록의 대표 칸 · 검색(Ctrl+K) 추천도 두쿠아리움 먼저
- 분위기: 어두운 글래스 + 은은한 네온. 사이트 기본색은 보라 · 핑크(`lumora-highlight` · `lumora-accent`), **두쿠아리움 부분만 청록 `#3ef2ff`**

## 2. 언어

- 화면에 보이는 글(버튼 · 제목 · 설명 · 알림 · `aria-label` · 블로그 글)은 **자연스러운 영어만** (`GEMINI.md`, `TOOL_GUIDELINES.md`)
- 예외 (한국어판을 따로 둔 곳): 두쿠아리움 홈페이지 · 방침 · 계정 삭제 안내 · 베타 모집 `/ko` (한국 사용자 · 한국 법 · 한국 친구들), 운동 캔버스 `/utilities/workout-canvas/ko`
- 코드 주석 · 래원에게 하는 설명은 한국어 가능. 커밋 메시지는 영어 (`feat:` `fix:` `perf:` `chore:` …)
- 두쿠아리움 용어는 앱과 똑같이: 난이도 **Relaxed · Intense** (예전 Easy · Hard 아님), 등급 **Common · Rare · Mystic · Legendary**, 생물 이름은 앱 번역 파일(doquarium 레포 `lib/l10n/app_en.arb`) 기준

## 3. 코드 지도

| 무엇 | 어디 |
| --- | --- |
| 화면 전환 · 주소 | `src/App.tsx`: `URL_TO_VIEW` · `VIEW_TO_URL` · `LANG_PAGES`(언어 하위 주소가 있는 페이지) · `viewFromPath` |
| 위 메뉴 · 검색 창 · 푸터 | `src/components/GNB.tsx` · `CommandPalette.tsx` · `App.tsx` 아래쪽 footer |
| 도구 목록 데이터 | `src/data/tools.ts` (이름 · slug · 설명 · 아이콘 · 사용법) |
| 도구 화면 연결 | `src/components/ToolDetailView.tsx` (도구마다 `lazy()`로 따로 불러옴) |
| 도구 카드 아이콘 | `src/components/ToolCard.tsx`의 `TOOL_ICONS` |
| 저널 글 | `src/data/posts/*.ts` |
| 두쿠아리움 홈페이지 | 화면 `src/components/DoquariumView.tsx` (언어 · 제목 · 진짜 주소를 스스로 정함) · 글 **`src/data/doquariumHome.ts`** (한 · 영, 원본은 doquarium 레포 docs/14 "스토어 등록정보 문구") · 앱 화면 `public/media/doquarium/{en,ko}/*.webp` (스토어 스크린샷 6장을 720px WebP로) · 홍보 영상 `DoquariumReel.tsx` |
| 홈 카드의 네온 어항 그림 | `src/components/NeonTank.tsx` (화면 밖에서 멈추기는 `src/lib/usePauseOffscreen.ts`) |
| 영상 · 큰 파일 | `public/media/` (웹용으로 줄인 것만) |
| 두쿠아리움 방침 · 삭제 안내 · 베타 모집 글 | `src/data/doquarium.ts` (원본) + 화면 `DoquariumDocView.tsx` (섹션에 `links`로 버튼) |
| 베타 모집 켜고 끄기 | `src/data/doquarium.ts`의 `BETA.recruiting` (끄면 홈 · 두쿠아리움 · 푸터의 버튼과 "Testers Wanted" 배지가 사라지고 "Coming Soon"으로) |
| 검색용 제목 · 설명 · 진짜 주소 | `src/seo.ts` |
| 사이트맵 · 로봇 | `public/sitemap.xml` · `public/robots.txt` |

## 4. 새로 만들 때 체크리스트

**새 페이지**
1. `App.tsx`에 view 이름 · 주소 (`URL_TO_VIEW` · `VIEW_TO_URL`, 언어판이 있으면 `LANG_PAGES`)
2. 들어갈 길: 위 메뉴(`GNB.tsx`) · 푸터 · 검색 창(`CommandPalette.tsx`의 `PAGE_ITEMS`) 중 맞는 곳
3. `src/seo.ts`의 `PAGES`에 제목 · 설명 (그 페이지에 실제로 있는 내용으로, 과장 X)
4. `public/sitemap.xml`에 `https://www.lumora.tools/…` 한 줄

**새 도구** (`TOOL_GUIDELINES.md` "How to Add a New Tool" + 아래)
1. `src/data/tools.ts`에 항목 (slug 꼭)
2. `src/tools/새도구.tsx` 만들고 `ToolDetailView.tsx`에 **`lazy(() => import(...))`**로 연결
3. 아이콘을 `ToolCard.tsx`의 `TOOL_ICONS`에 더하기 (안 더하면 카드에 아이콘이 안 나옴)
4. 검색 제목은 `seo.ts`가 이름 · 설명으로 저절로 만든다. `sitemap.xml`에 주소 한 줄

**새 저널 글**: `src/data/posts/`에 파일 + `index.ts` 목록, `sitemap.xml`에 `/journal/{id}`

## 5. 검색 · 방문자 분석 (2026-10-18 설정)

- **페이지 제목 · 설명 · 진짜 주소(canonical)**: `src/seo.ts`. 진짜 주소는 언제나 `https://www.lumora.tools` + 지금 경로 (www 없는 주소와 하나로 보이게). `index.html`에 진짜 주소를 고정으로 넣지 않는다 (모든 페이지가 홈을 가리키게 됨)
- **Google Search Console**: `raonepark@gmail.com` 계정에 `https://www.lumora.tools/` 등록 · 사이트맵 제출. `index.html`의 `google-site-verification` 줄은 **지우면 인증이 풀린다**
- **방문자 수**: Vercel Web Analytics (`@vercel/analytics`, `src/main.tsx`의 `<Analytics />`). 쿠키 없음 · 사람 구별 안 함. 그래서 홈 문구가 "No cookies, no file uploads"다. 쿠키 쓰는 분석(구글 애널리틱스 등) · 광고를 넣으려면 **먼저 래원에게 묻고** 이 문구도 고친다
- 아직: www 없는 주소 → www 넘어가기가 307(잠깐 이사)이라 Vercel 도메인 설정에서 308로 바꾸면 좋다 (래원 · Vercel 화면) · 네이버 서치어드바이저 등록

## 6. 빠르게 유지하기 (2026-10-10 느려짐 고친 뒤 규칙)

- **lucide 아이콘은 이름으로 하나씩** import. `import * as Icons from 'lucide-react'` 금지 (아이콘 1,400개가 전부 실려 첫 파일이 3MB가 됐었다)
- **무거운 라이브러리(PDF · 이미지 · 바코드 등)는 도구 파일 안에서만** 쓴다. 도구는 `lazy()`라 그 도구를 열 때만 받는다. 홈 · 공통 컴포넌트에서 import하지 않는다
- **끝없이 도는 애니메이션 X**: 카드 반짝임은 마우스를 올렸을 때만(`.group:hover .shimmer-effect`). 움직이는 SVG는 `usePauseOffscreen`(`src/lib/usePauseOffscreen.ts`)으로 화면 밖에서 멈춘다
- **SVG 빛 번짐 필터는 그룹에 한 번**. 선마다 `feGaussianBlur`를 걸지 않는다 (매 프레임 수십 번 다시 계산)
- 마우스 따라가는 효과는 React 상태 대신 `ref` + `requestAnimationFrame` + `transform` (blend mode X)
- 빌드 후 첫 파일(`dist/assets/index-*.js`)이 크게 늘었으면 이유를 찾는다 (지금 약 560KB)
- **영상은 웹용으로 줄여서** `public/media/`에: 720px 폭 · 30fps · H.264 `-crf 27 -movflags +faststart` · AAC 96k (30초 영상이 약 1.5MB). 원본은 레포에 넣지 않는다. 화면에 보일 때만 불러와 소리 없이 재생, 벗어나면 멈춤, 소리는 버튼으로 (`DoquariumReel.tsx`). 처음엔 정지 화면(poster)만

## 7. 두쿠아리움 방침 · 계정 삭제 안내

- 글의 원본은 **`src/data/doquarium.ts`**. 앱 기획 쪽 기록은 doquarium 레포 `docs/19 개인정보처리방침·계정 삭제.md`
- 앱에 서버로 보내는 정보가 새로 생기면 docs/19 **"사이트에 반영할 것"** 칸에 쌓이고, 래원이 "반영해줘" 하면:
  1. **노트만 믿지 말고 앱 코드로 확인** (doquarium 레포 `firestore.rules` · `lib/services/` · `functions/`). 노트에 없는 저장(예: 콕 알림 `pushLog`)이 있으면 래원에게 알리고 보관 기간부터 정한다
  2. 한 · 영 둘 다, 방침 + 계정 삭제 안내 둘 다
  3. "혼자 쓰면 아무것도 안 보낸다" · "계정과 이어진 것은 안 남는다" 같은 **문장이 아직 맞는지** 다시 본다
  4. **시행일(`effectiveDate`)은 그대로, `lastUpdated`(최근 수정일)만** 오늘로
  5. 반영 뒤 docs/19 맨 위 "사이트 반영 현황" 표에 한 줄 + 커밋 번호, "사이트에 반영할 것"은 비운다. Play "데이터 보안" 답안지도 고칠 게 있으면 docs/19에 🆕로 적고 래원에게 (Play Console은 래원이 직접)
- 보호책임자: Park Ra One · 문의 doquarium@gmail.com

## 8. 올리기 · 확인

1. `npm run lint` (= `tsc --noEmit`) → `npm run build` 둘 다 통과
2. 눈으로 확인: `npx vite --port=3000` → 브라우저로 바뀐 페이지 (모바일 너비도)
3. `main`에 커밋 · 푸시하면 **Vercel이 저절로 배포**한다 (레포 `roparkinfiniq/lumora.tools`)
   - 푸시 전 `git pull --rebase` (다른 곳에서 Code Tiara 다운로드 주소 등을 고치는 커밋이 올라올 때가 있다)
   - 배포 상태: `https://api.github.com/repos/roparkinfiniq/lumora.tools/commits/{커밋}/status`의 "Vercel"이 `success`가 될 때까지 (보통 1~3분, 가끔 10분)
   - 실제 사이트에 바뀐 글이 있는지 `https://www.lumora.tools`의 JS 파일에서 확인한 뒤 "반영됐다"고 말한다
4. 래원에게: 무엇을 왜 바꿨는지 짧게 + **"폰 · PC에서 이 주소를 열어 이걸 보세요"**

## 9. 하지 않는 것

- 영어 아닌 화면 글 (위 예외 말고)
- 확인 없이 쿠키 · 추적 · 광고 넣기, `google-site-verification` 지우기
- 앱에 없는 기능 · 숫자를 소개 페이지 · 방침에 쓰기 (예: 두쿠아리움 다 자라는 날 수는 "알면 김새는 숫자"라 쓰지 않는다)
- 빌드가 깨진 채 푸시

## 10. 결정 기록 (사이트)

| 날짜 | 결정 |
| --- | --- |
| 2026-10-09 | 두쿠아리움 소개 · 개인정보처리방침 · 계정 삭제 안내 페이지 (방침만 한 · 영) |
| 2026-10-09 | 보호책임자 실명 Park Ra One |
| 2026-10-10 | 두쿠아리움을 Code Tiara보다 앞에 (메뉴 · 홈 · 도구 목록 · 검색) |
| 2026-10-10 | 사이트 속도: 아이콘 하나씩 import, 도구 lazy, 끝없는 애니메이션 없애기 (첫 파일 3.27MB → 약 560KB) |
| 2026-10-10 | 난이도 이름 Relaxed · Intense (앱과 같이) |
| 2026-10-11 | 문의 글 보관: 처리 후 지우고 최대 1년 · 오류 기록 90일 |
| 2026-10-12 | 콕 알림 하루 1번 기록(pushLog) 2일 뒤 자동 삭제 |
| 2026-10-18 | 방문자 분석 Vercel Web Analytics (쿠키 없음) · Search Console(raonepark@gmail.com) · 페이지마다 제목 · 설명 · 진짜 주소 |
| 2026-10-18 | 두쿠아리움 홍보 영상(래원 `doquarium-reel-02-deep`, 세로 32초, 영어 자막)을 **두쿠아리움 페이지 맨 위에만** (홈은 가볍게 그대로). 13MB → 웹용 1.45MB |
| 2026-10-22 | `/doquarium`을 **두쿠아리움 공식 홈페이지**로 다시 만듦 (한 · 영 `/ko`): 스토어 문구 바탕 글 + 진짜 앱 화면 5장 + 홍보 영상 + 그 밖의 기능 6개 + 원칙 + 자주 묻는 질문 + 연락 · 방침 링크. 사이트가 그린 등급 물고기(`RarityFish`)는 앱과 생김새가 달라 뺌 (래원 결정: 주소 그대로 · 한영 · 진짜 화면 위주). 스토어 문구가 바뀌면 `doquariumHome.ts`도 |
| 2026-10-22 | 홈페이지에서 로그인해 할 일 보기 · 추가 · 끝내기: **출시 뒤** (doquarium 레포 docs/10 "PC에서 쓰기" · `later-13`). 웹은 우편함에 쪽지만 넣고 폰 앱이 열릴 때 반영 (물고기는 폰에만), 로그인은 구글 · 애플. 어디에 올릴지(lumora.tools · Firebase Hosting) · 범위는 아직 정할 것. 만들 때 방침(docs/19 → `doquarium.ts`)도 |
| 2026-10-18 | 두쿠아리움 베타 테스터 모집 페이지 `/doquarium/beta`(한 · 영) + 홈 · 두쿠아리움 페이지 버튼 (12명 · 14일 규칙, 잠시). 가입: 가장 쉬운 길은 Gmail을 doquarium@gmail.com으로 보내기, 직접은 크롬 → 그룹 가입 → 테스터 되기 → 설치 (doquarium docs/14와 같게). 다 모이면 `BETA.recruiting = false` |
