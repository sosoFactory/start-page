# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 이 문서에 기록됩니다.
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.21.3] - 2026-10-04

### 💄 UI/UX 및 텍스트 개선 (UI/UX & Copy)
- **오늘의 할 일 완료 항목 액션 버튼 텍스트 변경 (`components/TodoCard.tsx`, `PRD.md`)**:
  - 카드 헤더의 일괄 삭제 버튼 라벨을 직관적인 `완료 삭제`로 변경 (기존 `완료 정리`)
  - 툴팁 및 접근성 라벨(`aria-label`)을 버튼 기능(일괄 삭제)에 맞춰 명확하게 동기화

## [1.21.2] - 2026-10-02

### ✨ 신규 기능 (Feature)
- **크롬 확장 프로그램 바로가기 추가 팝업 스마트 태그 자동 추천 및 태그 편집/저장 기능 탑재 (`public/popup.html`, `public/popup.js`, `PRD.md`)**:
  - 도메인/키워드 분석 기반 규칙 사전(`TAG_RULES`) 및 테크/금융 약어 사전(`KNOWN_ACRONYMS`) 적용
  - 웹서핑 중 툴바 아이콘 클릭 시 현재 탭의 URL 및 제목을 분석하여 스마트 태그(예: `#개발`, `#AI`, `#미디어` 등)를 자동 추천 및 기본 칩으로 세팅
  - 팝업 내 태그 직접 추가(`Enter`, 쉼표), 태그 칩 삭제(`X` 버튼, `Backspace`) 및 추천 칩 클릭 즉시 추가 UI 지원
  - 저장 시 `tags: string[]` 배열을 `saniti_links_v1` 스토리지에 포함하여 대시보드 새 탭 페이지의 태그 클라우드 및 필터와 즉시 연동

## [1.21.1] - 2026-10-02

### ✨ 신규 기능 및 인터랙션 개선 (Feature & Interaction)
- **오늘의 할 일 드래그 핸들 및 순서 재배치(Drag & Drop Reorder) 구현 (`components/TodoCard.tsx`, `App.tsx`, `styles/app.css`)**:
  - 각 할 일 항목 앞단에 은은한 드래그 핸들(`GripVertical`) 아이콘 탑재 (`cursor: grab / grabbing`)
  - 마우스로 끌어서 현재 탭 내에서 할 일 순서를 자유롭게 재배치하고 로컬 스토리지에 즉시 영속 저장
  - 드래그 영역의 불필요한 툴팁을 제거하여 화면 클리핑 및 간섭 방지
  - `overflow-x: hidden`, `touch-action: pan-y`, 요소 크기 불변 하이라이트 적용으로 드래그 중 좌우 흔들림 및 가로 스크롤 발생 완전 차단

## [1.21.0] - 2026-10-02

### ✨ 신규 기능 (Feature)
- **오늘의 할 일 다중 탭 시스템 및 탭 관리/이동 기능 탑재 (`components/TodoCard.tsx`, `types/todo.ts`, `App.tsx`, `styles/app.css`)**:
  - `TodoTab` 데이터 모델 및 상단 탭 바 도입으로 주제별(기본, 업무, 개인 등) 할 일 분리 관리 지원
  - 탭별 실시간 완료/전체 카운트 배지 표기 및 마지막 활성 탭 스토리지 영속화
  - `+` 버튼을 통한 인라인 새 탭 추가, 탭 더블클릭/수정 아이콘으로 이름 변경, `X` 버튼으로 간편한 탭 삭제 지원
  - 탭 삭제 시 소속된 할 일 항목들을 기본 탭으로 자동 안전 이전하여 데이터 유실 방지
  - 할 일 항목 호버 시 이동(`ArrowRightLeft`) 버튼을 통해 원클릭으로 다른 탭으로 항목 이동 지원
  - 카드 헤더의 `완료 정리` 버튼이 현재 활성화된 탭의 완료 항목들만 깔끔하게 정리하도록 개선

## [1.20.3] - 2026-10-02

### ✨ 신규 기능 및 데이터 정규화 (Feature & Data Normalization)
- **태그 대소문자 무시(Case-Insensitive) 통합 및 표준 정규화 시스템 도입 (`utils/tagHelper.ts`, `components/LinksHub.tsx`, `components/BookmarkModal.tsx`)**:
  - `KNOWN_ACRONYMS` 사전을 통해 주요 약어(`AI`, `UI`, `UX`, `API`, `AWS`, `IT`, `DB`, `SQL`, `ML`, `GPT`, `LLM`, `PDF` 등) 자동 대문자 변환
  - 영단어는 첫 글자 대문자인 Title Case(예: `git` ➔ `Git`, `notion` ➔ `Notion`, `dev` ➔ `Dev`)로 정규화하고 한글/숫자는 원본 형태 보존
  - `git`, `Git`, `GIT` 등 대소문자가 다른 태그들을 태그 클라우드에서 `#Git (3)` 하나로 통합 집계
  - 태그 클라우드에서 `#Git` 클릭 시 대소문자 상관없이 해당 태그를 가진 모든 북마크 즉시 필터링
  - 북마크 관리 모달에서 대소문자 중복 입력 방지 및 추천 칩 중복 필터링 적용

## [1.20.2] - 2026-10-02

### 💄 UI/UX 및 반응형 개선 (UI/UX & Responsive Layout)
- **태그 클라우드 가로 스크롤 제거 및 2줄 동적 감지 더보기 토글 탑재 (`components/LinksHub.tsx`, `styles/app.css`)**:
  - 가로 스크롤(`overflow-x: auto`)을 완전히 제거하고 단정한 줄바꿈(`flex-wrap: wrap`) 랩 레이아웃 적용
  - `ResizeObserver` 및 자식 요소 `offsetTop` 계산을 통해 실제 렌더링된 줄 수가 2줄을 초과하는지 실시간 감지하여 `더보기 ▾` / `접기 ▴` 토글 버튼 자동 노출
  - 태그 알약 높이를 24px로 정밀 고정하고 컨테이너 최대 높이를 53px로 맞춤 조절하여 접힌 상태에서 3번째 줄이 미세하게 노출되는 현상 방지
  - 브라우저 창 크기 조절 시에도 실시간으로 2줄 초과 여부를 자동 재계산

## [1.20.1] - 2026-10-02

### ⚡ 성능 및 데이터 마이그레이션 (Performance & Data Migration)
- **기존 북마크 스마트 태그 1회성 안전 마이그레이션 (`App.tsx`, `utils/tagHelper.ts`)**:
  - 기존 즐겨찾기에 태그가 없는 경우 URL/사이트명 기반으로 스마트 추천 태그를 자동 생성하여 로컬 스토리지에 즉시 반영
  - `saniti_tag_migrated_v1` 플래그를 통해 최초 1회만 실행하고 이후 새 탭 로드 시에는 검사를 생략하여 불필요한 연산 방지 및 사용자 수정 의도 영구 보존
  - 한국어 키워드(비트코인, 퀀트, 주식, 노션, 유튜브 등) 매칭 사전 대폭 확장

## [1.20.0] - 2026-10-02

### ✨ 신규 기능 (Feature)
- **즐겨찾기 태그 시스템 및 태그 클라우드 필터 바 도입 (`components/LinksHub.tsx`, `components/BookmarkModal.tsx`, `utils/tagHelper.ts`, `data/presetLinks.ts`, `styles/app.css`)**:
  - `BookmarkLink` 데이터 모델에 `tags?: string[]` 속성 추가 및 기본 프리셋 링크에 대표 태그 부여
  - 링크 허브 상단에 수평 스크롤 형태의 '태그 클라우드 바'(`전체` + 각 태그별 빈도수 칩) 탑재 및 원클릭 실시간 필터링 지원 (검색창과 완벽 연동)
  - 바로가기 타일 하단에 정갈한 컴팩트 태그 뱃지(`#태그`) 시각화
- **스마트 자동 태그 추천 엔진 (`utils/tagHelper.ts`)**:
  - 바로가기 등록 시 URL 및 사이트명 입력에 따라 도메인/키워드 규칙 및 기존 태그 목록 기반으로 최적의 태그 자동 추론 및 추천 칩 제공
  - `Enter`/쉼표(`,`)를 통한 손쉬운 태그 추가 및 `X` 삭제 지원
- **데이터 백업 및 복원 호환성 확보 (`components/SettingsModal.tsx`)**:
  - JSON 내보내기/가져오기 시 `tags` 필드 온전히 포함 및 스키마 검증

## [1.19.1] - 2026-09-30

### 💄 사용성 및 UI 개선 (UX Improvement)
- **할 일 목록(To-Do List) 인터랙션 및 상태 제어 강화 (`components/TodoCard.tsx`, `styles/app.css`)**:
  - 할 일 텍스트를 `<label>`로 체크박스와 연결하여 텍스트 영역 클릭 시에도 원클릭 완료/미완료 토글 지원
  - 항목 호버 시 명시적 수정(`Pencil`) 아이콘 버튼 제공 및 인라인 편집 UX 지원 (`Enter`/`blur` 시 저장, `ESC` 취소)
  - 카드 헤더의 `완료 정리` 버튼을 상시 노출하되 완료 항목이 없을 경우 `disabled` 상태로 비활성화하여 UI 깜빡임 및 레이아웃 흔들림 방지

## [1.19.0] - 2026-09-30

### ✨ 신규 기능 (Feature)
- **오늘의 할 일 (To-Do List) 위젯 신규 도입 (`components/TodoCard.tsx`, `types/todo.ts`, `data/presetTodos.ts`, `styles/app.css`)**:
  - 우측 사이드바 하단에 주식 모듈 대신 깔끔하고 직관적인 '오늘의 할 일' 위젯 배치
  - 인라인 텍스트 입력창에서 `Enter` 키 또는 `+` 버튼으로 빠른 할 일 등록 및 자동 포커스 유지
  - 원클릭 체크박스로 완료/미완료(`completed`) 토글, 완료 시 취소선 및 은은한 뮤트 컬러 시각화
  - 진행 현황 배지(`완료 N / 전체 M`), 완료된 항목 일괄 정리(`완료 정리`), 개별 항목 삭제(`Trash2`) 및 더블클릭 인라인 수정 지원
  - `saniti_todos_v1` 로컬 스토리지 연동(100% 로컬 영속성 및 멀티 탭 실시간 동기화)과 100vh 무스크롤 내부 슬림 스크롤 적용
- **주식 모듈 보존 및 모듈형 교체 아키텍처 PRD 로드맵 등록 (`PRD.md`)**:
  - 기존 주식 모듈(`StockCard`, `stockService`, `stockData`)을 코드베이스에 안전하게 보존
  - 향후 사이드바 위젯 동적 교체 시스템(할 일 / 주식 / 메모 등)을 PRD 로드맵에 공식 반영

## [1.18.4] - 2026-09-15

### 🐛 버그 수정 및 파비콘 리졸버 정교화 (Bug Fix & Favicon Improvement)
- **멀티 테넌트 호스팅 플랫폼 상위 파비콘 상속 제외 및 스마트 이니셜 배지 적용 (`utils/faviconHelper.ts`)**:
  - `github.io`, `gitlab.io`, `vercel.app`, `netlify.app`, `pages.dev`, `web.app`, `firebaseapp.com`, `surge.sh`, `render.com`, `tistory.com`, `notion.site`, `blogspot.com`, `wordpress.com` 등 멀티 테넌트/블로그 플랫폼을 `MULTI_TENANT_HOSTS`로 정의
  - 멀티 테넌트 서브도메인(`haksoo0918.github.io` 등)에 자체 파비콘이 없을 경우 상위 호스팅 도메인(GitHub 옥토캣 로고 등)을 상속받지 않고 **스마트 이니셜 배지(`비`)**로 정확하게 표시
  - 일반 브랜드 서브도메인(`app.tina.io` 등)은 상위 메인 도메인의 고화질 브랜드 파비콘을 정상 상속하도록 분리 유지

## [1.18.3] - 2026-09-15

### 🐛 버그 수정 및 파비콘 리졸버 개선 (Bug Fix & Favicon Improvement)
- **Google Favicon V2 엔드포인트 및 서브도메인 상위 폴백 체계 구축 (`utils/faviconHelper.ts`, `components/LinksHub.tsx`)**:
  - 레거시 S2 대신 최신 Chrome CDN인 Google Favicon V2(`t2.gstatic.com/faviconV2`)를 1차 소스로 채택하여 Tina(`tina.io`, `tinacms.org`) 등 최신 웹사이트의 고화질 파비콘 지원 확대
  - `app.tina.io` 등 서브도메인 등록 시 상위 메인 루트 도메인의 FaviconV2를 2차로 자동 조회하여 브랜드 파비콘을 정상 렌더링하도록 개선

## [1.18.2] - 2026-09-15

### 🐛 버그 수정 (Bug Fix)
- **16x16 고유 파비콘(Tina 등) 보존 및 Google S2 기본 지구본 정밀 감별 (`utils/faviconHelper.ts`, `components/LinksHub.tsx`)**:
  - Google S2에서 `16x16` 크기로 반환되는 파비콘 중, 파비콘 부재 시 반환되는 726 바이트 기본 회색 지구본 PNG를 정밀 비교하는 `isDefaultGlobeImage` 검증 탑재
  - Tina(`tinacms.org`, 573B) 등 원본이 16x16인 정상 사이트의 고유 파비콘을 지구본으로 오인하지 않고 온전히 보존하며, 파비콘 미등록 사이트(`haksoo0918.github.io`, 726B)만 스마트 이니셜 배지로 정확히 전환

## [1.18.1] - 2026-09-15

### 🐛 버그 수정 및 UI 가시성 개선 (Bug Fix & UX Improvement)
- **검색창 너비 확장 및 플레이스홀더 글자 잘림/겹침 해결 (`styles/app.css`)**:
  - `.links-search-box` 너비를 `215px` (포커스 시 `245px`)로 확장하여 `바로가기 검색... (단축키: /)` 문구가 `<kbd>/</kbd>` 배지와 겹치지 않고 온전히 표시되도록 개선
- **가짜 플레이스홀더 차단 및 3단계 클린 파이프라인 개편 (`utils/faviconHelper.ts`, `components/LinksHub.tsx`)**:
  - 404 상태에서 회색 원형 아이콘(`>`) PNG를 내려주던 DuckDuckGo를 완전 배제하고, 1차 Google S2(64px) ➔ 2차 직접 루트(`/favicon.ico`) ➔ 3차 스마트 이니셜 배지의 클린 파이프라인 구축
  - Google S2 16x16 회색 지구본 플레이스홀더 감지 및 React Key 분리(`key={`${url}-${sourceIndex}`}`)로 파비콘 미등록 사이트에서 스마트 이니셜 배지가 항상 정확하게 표시되도록 보장

## [1.18.0] - 2026-09-15

### ✨ 신규 기능 (Feature)
- **검색창 전역 단축키(`/`) 포커스 및 힌트 UI 지원 (`components/LinksHub.tsx`, `app.css`)**:
  - 대시보드 어디서든 `/` 키를 누르면 즉시 바로가기 검색 입력창으로 포커스 이동 및 텍스트 자동 선택
  - 다른 입력 필드(input/textarea/select) 포커스 중이거나 모달 오픈 시 단축키 간섭 방지 및 `e.preventDefault()`로 `/` 문자 삽입 차단
  - `ESC` 키 입력 시 검색창 초기화 및 포커스 해제(`blur()`)
  - 검색창 우측에 시각적 단축키 힌트 배지(`<kbd>/</kbd>`) 제공 (검색어 입력 시 `X` 지우기 버튼으로 자동 전환)

## [1.17.0] - 2026-09-15

### ✨ 신규 기능 (Feature)
- **대시보드 하단 푸터(Footer) 컴포넌트 구축 (`components/Footer.tsx`, `constants/appInfo.ts`, `app.css`)**:
  - `© sosoFactory` 저작권 문구 및 GitHub 공식 저장소 새 탭 링크 제공
  - 현재 애플리케이션 버전(`v1.17.0`) 배지 태그 표기
  - 대시보드의 스크롤 없는 엄격한 100vh 고정 레이아웃을 온전히 유지하는 슬림 반응형 스타일 적용

## [1.16.1] - 2026-09-15

### 🐛 버그 수정 (Bug Fix)
- **Google S2 기본 회색 지구본(Default Globe) 감지 및 자동 폴백 (`components/LinksHub.tsx`, `PRD.md`)**:
  - Google S2 Favicon API가 파비콘 미등록 도메인에 대해 에러 대신 16x16 크기의 기본 회색 지구본 PNG를 반환하여 정상 로드로 오인되던 문제 해결
  - `img.onLoad` 시점에 16x16 기본 플레이스홀더를 감지하여 2차 DuckDuckGo ➔ 3차 루트 파비콘 ➔ 최종 스마트 이니셜 배지로 정상 자동 폴백되도록 수정

## [1.16.0] - 2026-09-15

### ✨ 신규 기능 (Feature)
- **다단계 파비콘 폴백 체인 구축 (`utils/faviconHelper.ts`, `components/LinksHub.tsx`)**:
  - 1차 Google S2(64px) ➔ 2차 DuckDuckGo Icons ➔ 3차 직접 도메인 루트(`/favicon.ico`)의 3단계 순차 폴백 로직 적용
- **스마트 이니셜 배지 (Smart Initial Badge) 시스템 구축 (`utils/faviconHelper.ts`, `app.css`)**:
  - 파비콘이 없거나 모든 소스 로드 실패 시 직관적인 이니셜 배지 렌더링
  - 한글 첫 1글자(`네이버` ➔ `네`), 영문 복합어/공백/하이픈 앞글자(`Stack Overflow` ➔ `SO`), CamelCase(`GitHub` ➔ `GH`), 영문 단일 단어 앞 2글자(`Notion` ➔ `NO`) 자동 추출
  - 도메인/타이틀 해시 기반의 7대 파스텔 브랜드 테마 색상 자동 배정
- **인메모리 세션 캐싱 최적화 (`utils/faviconHelper.ts`)**:
  - 세션 동안 성공한 파비콘 URL 및 배지 전환 여부를 캐시하여 렌더링 시 불필요한 반복 404 재요청 방지

## [1.15.0] - 2026-09-08

### ♻️ 코드 구조 리팩토링 및 모달 UX 개선 (Refactor & UX Improvement)
- **공통 기반 모달 컴포넌트 구축 (`components/common/Modal.tsx`)**:
  - `BookmarkModal`, `RegionSelectModal`, `SettingsModal`의 공통 오버레이, 헤더(아이콘+타이틀+닫기버튼), 본문, 푸터 구조를 단일 컴포넌트로 일원화
  - `ESC` 키보드 닫기 이벤트 리스너 자동 관리 및 인풋 드래그 오작동 방지 배경 클릭 감지 내장
- **자연스럽고 부드러운 모달 팝업 애니메이션 (`app.css`)**:
  - 오버레이 페이드인(`modalOverlayFadeIn`) 및 다이얼로그 스케일 팝인(`modalDialogPopIn`) 적용
- **전체 모달 컴포넌트 전면 리팩토링 (`BookmarkModal.tsx`, `RegionSelectModal.tsx`, `SettingsModal.tsx`)**:
  - 중복 보일러플레이트 코드를 제거하고 공통 `Modal` 컴포넌트로 마크업 단일화

## [1.14.0] - 2026-09-08

### ✨ 신규 기능 및 인터랙션 개선 (Feature & Interaction)
- **헤더 설정 버튼 텍스트 표기 (`App.tsx`, `app.css`)**:
  - 대시보드 우측 상단 톱니바퀴 버튼에 **'설정'** 텍스트를 나란히 배치하여 직관성 및 가독성 개선
- **모던 커스텀 툴팁 시스템 구축 (`app.css`)**:
  - 브라우저 기본 `title` 속성을 툴팁 도구로 사용하지 않는 원칙 확립
  - 순수 CSS 기반 `[data-tooltip]` 시스템 구축 (다크 톤 `#0f172a`, 부드러운 페이드인 트랜지션)
  - `overflow: hidden` 컨테이너 상단 잘림 방지를 위한 `data-tooltip-pos="bottom-left"` 포지셔닝 탑재
- **텍스트 없는 아이콘 전용 버튼 툴팁 전수 적용 (`RainForecastCard.tsx`, `StockCard.tsx`, `LinksHub.tsx`, 모달들)**:
  - 날씨/시세 새로고침, 북마크 수정/삭제, 검색어 지우기, 모달 닫기 버튼에 호버 툴팁 적용 완료

## [1.13.0] - 2026-09-08

### 🎨 디자인 시스템 및 타이포그래피 개선 (Design System Refactor)
- **전역 기본 폰트 Pretendard(프리텐다드) 100% 단일화 (`index.html`, `saniti-tokens.css`, `popup.html`)**:
  - 기존 구글 폰트(`IBM Plex Mono`, `Noto Sans KR`) 로드를 완전히 제거하여 로딩 최적화
  - 가볍고 가독성이 뛰어난 Pretendard 웹폰트 CDN 연결 및 전역 `--font-sans` 설정
- **모노스페이스 폰트 설정 및 잉여 변수 삭제 (`saniti-tokens.css`, `RegionSelectModal.tsx`)**:
  - 실제 쓰이지 않던 `--font-mono` 토큰 및 불필요한 인라인 모노 폰트 스타일 완전 삭제
- **차트 및 컴포넌트 인라인 폰트 전수 정돈 (`RainForecastCard.tsx`, `StockCard.tsx`, `LinksHub.tsx`, `BookmarkModal.tsx`, `SettingsModal.tsx`)**:
  - Recharts 강수확률 바 차트(`XAxis`, `Tooltip`) 및 시세 차트 폰트를 Pretendard로 통일
  - 하드코딩되어 있던 Noto Sans KR 인라인 스타일을 전수 제거하여 전역 서체 상속

## [1.12.1] - 2026-09-08

### 🐛 버그 수정 및 UI/UX 개선 (Bug Fix & UX Improvement)
- **헤더 디지털 시계 개방형 대형 타이포그래피 개선 (`HeaderClock.tsx`, `app.css`)**:
  - 배경 박스 및 테두리를 제거하여 헤더에 자연스럽게 융합되는 미니멀 타이포그래피 적용
  - 시간 텍스트 크기를 `18px` Bold (`tabular-nums`)로 대폭 확대하여 가시성 극대화
  - 날짜(`9월 8일 (화)`)와 구분자(`·`) 정돈
- **설정 모달 헤더 및 데이터 관리 레이아웃 깨짐 수정 (`SettingsModal.tsx`, `app.css`)**:
  - 모달 헤더 좌측 아이콘과 제목의 `flex` 중앙 수평 정렬(`modal-header-left`) 확립
  - 북마크 내보내기/가져오기/초기화 행의 설명 텍스트(`flex: 1`)와 버튼 컨테이너(`flex-shrink: 0`, `white-space: nowrap`) 간의 레이아웃 충돌 해결
  - `btn-secondary` 및 `btn-danger-outline` 인라인 플렉스 버튼 스타일 정립

## [1.12.0] - 2026-09-08

### ✨ 신규 기능 (Feature)
- **종합 설정 모달 시스템 구축 (`SettingsModal.tsx`, `types/settings.ts`, `app.css`)**:
  - 우측 상단 톱니바퀴 버튼을 클릭하여 여는 다기능 설정 모달 레이어 구현
  - **일반 설정**: 링크 클릭 시 새 탭 열기(`openInNewTab`) 토글, 헤더 실시간 디지털 시계 표시 토글, 12시간/24시간제 세그먼트 전환, 초 단위 표시 토글
  - **데이터 관리**: 북마크 링크 JSON 백업(내보내기) 및 복원(가져오기), 기본 5개 프리셋으로 초기화 기능 통합
  - **안내 및 보안**: 로컬 브라우저 저장소 기반 보안 원칙 및 즐겨찾기 바 고정 가이드 제공
- **헤더 실시간 디지털 시계 위젯 (`HeaderClock.tsx`, `app.css`)**:
  - `date-fns` 기반 실시간 날짜(월/일/요일) 및 1초 간격 시간 갱신 위젯 탑재
  - 대시보드 설정과 실시간 연동 (표시 ON/OFF, 12h/24h, 초 단위 표시)
- **설정 로컬스토리지 영속화 (`App.tsx`, `useLocalStorage.ts`)**:
  - `saniti_settings_v1` 키를 통해 사용자의 대시보드 환경설정 자동 보존

## [1.11.1] - 2026-09-07

### 🎨 UI/UX 구조 개선 및 검색창 가시성 강화 (UI Refactor)
- **대시보드 우측 상단 설정 드롭다운 메뉴 추가 (`SettingsDropdown.tsx`, `App.tsx`, `app.css`)**:
  - 대시보드 헤더에 톱니바퀴(`Settings`) 아이콘의 설정 버튼 배치
  - 북마크 백업(내보내기) 및 복원(가져오기) 기능을 설정 드롭다운 팝오버로 통합 이전
- **자주 가는 링크 카드 헤더 정돈 및 검색창 UI 개선 (`LinksHub.tsx`, `app.css`)**:
  - 카드 헤더에서 내보내기/가져오기 버튼을 제거하여 검색창과 추가 버튼으로 간결화
  - 검색창 높이를 버튼 높이(`30px`)와 일치시키고 너비 확장(`160px` ➔ `210px`) 및 테두리 가시성 강화

## [1.11.0] - 2026-09-07

### ✨ 신규 기능 (Feature)
- **자주 가는 링크 실시간 인라인 검색 및 필터링 (`LinksHub.tsx`, `app.css`)**:
  - 카드 헤더에 미니멀한 검색창(`Search`) 탑재
  - 별도 검색 버튼 없이 키워드 입력 즉시 사이트 이름 및 URL 실시간 대조 필터링
  - 원클릭 검색어 지우기(`X`) 버튼 및 키보드 `ESC` 키 초기화 지원
  - 검색 중 드래그 앤 드롭 정렬 잠금 및 검색 결과 없음 빈 상태 UI 제공

## [1.10.2] - 2026-09-07

### ✨ 신규 기능 (Feature)
- **크롬 확장 프로그램 툴바 팝업 내 북마크 중복 감지 및 안내 UI (`popup.js`, `popup.html`)**:
  - 현재 활성 탭 URL과 저장된 북마크 목록을 정규화하여 실시간 대조
  - 이미 등록된 사이트의 경우 입력 폼 대신 기존 등록명과 함께 **"⭐ 이미 등록된 바로가기입니다"** 안내 카드 및 확인 버튼 표시

## [1.10.1] - 2026-09-07

### 🎨 UI/UX 개선 및 데이터 모델 최적화 (UI & Refactor)
- **북마크 내보내기/가져오기 버튼 그룹화 (`LinksHub.tsx`, `app.css`)**:
  - `[ ⬇ 내보내기 | ⬆ 가져오기 ]` 형태의 세그먼트 버튼 그룹(`.btn-group`)을 적용하여 헤더 UI 일체감 개선
- **북마크 데이터 모델 경량화 (`presetLinks.ts`, `BookmarkModal.tsx`, `popup.js`)**:
  - 미사용 `category` 속성을 데이터 인터페이스 및 저장소, JSON 입출력에서 완전히 제거하여 필수 3개 속성(`id`, `title`, `url`)으로 간소화

## [1.10.0] - 2026-09-07

### ✨ 신규 기능 (Feature)
- **북마크 JSON 내보내기 / 가져오기 백업 및 복원 기능 (`LinksHub.tsx`)**:
  - `자주 가는 링크` 카드 헤더에 `[내보내기]` 및 `[가져오기]` 버튼 추가
  - 현재 저장된 북마크 데이터를 `startpage-bookmarks-YYYYMMDD.json` 파일로 즉시 다운로드 백업 지원
  - 외부 JSON 파일로부터 북마크 데이터를 안전하게 검증 및 일괄 복원하는 파일 로드 지원

## [1.9.4] - 2026-09-07

### 🛡️ 안정성 및 성능 최적화 (Bug Fix & Optimization)
- **스토리지 레이스 컨디션 덮어쓰기 버그 원천 수정 (`useLocalStorage.ts`)**:
  - `isHydratedRef` 하이드레이션 가드를 구축하여, 시작페이지가 닫혀있을 때 툴바 팝업으로 추가한 최신 링크가 새 탭 오픈 시 이전 상태로 덮어씌워지던 문제 해결
- **기본 프리셋 링크 5개 간소화 (`presetLinks.ts`, `popup.js`)**:
  - 대표 5개 핵심 사이트(YouTube, GitHub, ChatGPT, Naver, Google)로 가볍게 정리하여 데이터 일원화

## [1.9.3] - 2026-09-05

### 📋 로드맵 및 기획 (Planning & Docs)
- **추가 개발 백로그 계획서 [TODO.md](TODO.md) 작성**:
  - 우측 상단 실시간 디지털 시계 및 토글 스위치 기획
  - 설정 방법, 툴바 별 아이콘 활용법, 로컬스토리지 안내를 포함한 종합 도움말(`HelpModal`) 기획
  - 북마크 JSON 백업/복원 등 향후 로드맵 정리

## [1.9.2] - 2026-09-05

### 📖 문서화 및 가이드 완성 (Docs)
- **최신 기능 명세 [README.md](README.md) 반영**:
  - 툴바 별(⭐) 아이콘 미니 팝업을 통한 1초 바로가기 추가 및 실시간 무중단 동기화 기능 수록
  - 바로가기 타일 도메인 호스트 볼드(Bold) 강조, 세부 경로 표시 및 말줄임표 처리 명세 반영
  - 확장 프로그램 등록 후 툴바 별 아이콘 활용 팁 안내

## [1.9.1] - 2026-09-05

### 🎨 디자인 및 브랜딩 (Design & Branding)
- **크롬 확장 프로그램 별(Star) 모양 툴바 아이콘 적용**:
  - `public/icons/`: Saniti 코랄 포인트 컬러(`#f36458`)의 정갈한 5각 별 아이콘 4개 해상도(16px, 32px, 48px, 128px) 및 SVG 생성
  - `public/manifest.json`: `icons` 및 `action.default_icon`에 별 아이콘 등록

## [1.9.0] - 2026-09-05

### ✨ 신규 기능 (Feature)
- **크롬 확장 프로그램 툴바 미니 팝업 바로가기 추가 지원**:
  - `public/popup.html` 및 `public/popup.js`: 서핑 중 브라우저 툴바의 확장 아이콘 클릭 시 현재 탭의 제목/URL이 자동 채워지는 Saniti Light 스타일 미니 팝업창 제공
  - `src/hooks/useLocalStorage.ts`: `chrome.storage.local` 및 `chrome.storage.onChanged` 실시간 리스너를 연동하여, 팝업에서 추가한 링크가 이미 열려 있는 대시보드에 새로고침 없이 즉각 반영
  - `public/manifest.json`: `action` 팝업 및 `activeTab`, `storage` 권한 등록

## [1.8.0] - 2026-09-04

### ✨ 신규 기능 및 UX 개선 (Feature & UX)
- **바로가기 URL 전체 경로 표시 및 호스트(Host) 볼드 강조**:
  - `LinksHub.tsx`: `formatDisplayUrl` 파싱을 통해 도메인뿐만 아니라 하위 세부 경로(Path/Query)까지 표시되도록 개선
  - `app.css`: 호스트(`.link-url-host`)는 `font-weight: 600`으로 또렷하게 굵게 강조하고, 하위 경로(`.link-url-path`)는 `font-weight: 400` 은은한 톤으로 자연스럽게 연결
  - `text-overflow: ellipsis` 말줄임표 처리를 보장하여 카드 너비를 초과해도 타일 높이나 그리드가 깨지지 않도록 레이아웃 보호

## [1.7.4] - 2026-09-02

### 📖 문서화 및 마크다운 정돈 (Docs)
- **README 마크다운 취소선 문법 버그 수정 (`README.md`)**:
  - 장 운영 시간 표기(`~`)가 취소선 문법으로 오작동하던 문제를 하이픈(`09:00 - 15:30`)으로 수정하여 텍스트 가독성 정상화

## [1.7.3] - 2026-09-02

### 📖 문서화 및 시각 자료 완성 (Docs)
- **대시보드 실제 미리보기 캡쳐 수록 (`docs/screenshot.png`)**:
  - 실제 구동 화면을 README 상단에 배치하여 프로젝트 직관성 극대화
- **4대 핵심 기능 상세 명세 및 설정 가이드 완성 (`README.md`)**:
  - 자주 가는 링크 허브 (62%), 날씨 및 48시간 강수 예보 (38%), 7대 시세, Saniti Light 디자인 명세 복원
  - GitHub Pages 웹 설정 및 크롬 확장 프로그램 2가지 등록 방법 정돈

## [1.7.2] - 2026-09-02

### ⚙️ CI/CD 및 문서 정돈 (CI/CD & Docs)
- **GitHub Actions Node.js 24 최신 런타임 적용**:
  - `.github/workflows/deploy.yml`에서 Node.js 버전을 24로 올려 러너 만료(Deprecation) 경고 완전 해소

## [1.7.1] - 2026-09-02

### 📖 문서화 완성 (Docs)
- **종합 [README.md](README.md) 완성**:
  - [방법 1] GitHub Pages 웹 주소(`https://sosofactory.github.io/start-page/`)를 통한 브라우저 홈 설정 가이드 및 GitHub Pages 1회 활성화 단계별 안내
  - [방법 2] 크롬 확장 프로그램 등록 가이드 (로컬/오프라인 새 탭 오버라이드)
  - 새 탭(`Ctrl+T`) 단축키 연동 팁 (*New Tab Redirect* 활용)

## [1.7.0] - 2026-09-02

### 🌐 배포 및 플랫폼 확장 (Deployment & CI/CD)
- **GitHub Pages 무료 호스팅 배포 지원**:
  - `vite.config.ts` 상대 경로(`base: './'`) 설정을 적용하여 서브 경로에서도 JS/CSS 에셋 무결성 보장
  - `.github/workflows/deploy.yml` GitHub Actions 자동 배포 파이프라인 구축 (main 브랜치 Push 시 자동 빌드 및 Pages 배포)

## [1.6.4] - 2026-09-02

### 🧹 코드 최적화 및 잔여물 정리 (Cleanup & Refactor)
- **미사용 스크래핑 유틸리티 제거 (`urlHelper.ts`)**:
  - 제목 자동 파싱 제거에 따라 불필요해진 `fetchPageTitle`, `extractTitleFromHtml` 등 미사용 함수 삭제
- **단위 테스트 최적화 (`urlHelper.test.ts`)**:
  - `normalizeUrl` 핵심 무결성 검증으로 정돈
- **미사용 CSS 선택자 삭제 (`app.css`)**:
  - 삭제된 헤더 상태 문구용 `.header-status` 스타일 제거

## [1.6.3] - 2026-09-02

### 🛡️ 안정성 및 UX 개선 (Bug Fix & UX)
- **모달 내부 텍스트 드래그 시 닫힘 버그 수정**:
  - `BookmarkModal.tsx` 및 `RegionSelectModal.tsx`의 오버레이 닫기 핸들러를 `onMouseDown` + `e.target === e.currentTarget`으로 변경하여 인풋창 내 텍스트 드래그 시 모달이 닫히는 현상 원천 차단
- **제목 자동완성 기능 제거 및 폼 간소화**:
  - 대기 시간을 유발하던 외부 API 비동기 파싱, debounce 타이머, 스피너를 제거하고 가볍고 즉각적인 직접 입력 폼으로 전환

## [1.6.2] - 2026-09-02

### ⚡ UX 및 디자인 정돈 (UX & Cleanup)
- **바로가기 클릭 시 현재 탭 이동**:
  - `LinksHub.tsx`의 `target="_blank"` 속성을 제거하여 새 창이 아닌 현재 탭에서 즉시 사이트로 전환
- **헤더 우측 불필요한 상태 문구 삭제**:
  - `App.tsx` 헤더의 지역 및 비 소식 상태 텍스트(`header-status`)를 제거하여 정갈한 미니멀 타이틀 라인으로 정리

## [1.6.1] - 2026-09-02

### 📝 문서화 및 코드 정돈 (Docs & Cleanup)
- **전체 소스 코드 및 스타일시트 주석 100% 한글화**:
  - 컴포넌트(`App.tsx`, `BookmarkModal.tsx`, `LinksHub.tsx`, `RainForecastCard.tsx`, `StockCard.tsx`, `RegionSelectModal.tsx`)
  - 데이터 및 서비스(`stockData.ts`, `stockService.ts`, `useLocalStorage.ts`)
  - 스타일시트(`app.css`, `saniti-tokens.css`)

## [1.6.0] - 2026-09-02

### 🚀 배포 및 플랫폼 확장 (Platform & Extension)
- **크롬 확장 프로그램 (Manifest V3) 정식 지원**:
  - `public/manifest.json` 구성을 통해 `dist` 폴더를 Chrome, Edge, Whale 브라우저의 새 탭 확장 프로그램으로 직접 등록 가능 (로컬 서버/터미널 실행 불필요)
  - `host_permissions` 권한 등록을 통해 확장 프로그램 환경에서의 Yahoo Finance 및 외부 API CORS 차단 원천 해결

## [1.5.2] - 2026-09-02

### 🎨 UI 및 스타일 정돈 (Style & Cleanup)
- **새 바로가기 추가 타일 원본 디자인 복원**:
  - `add-link-tile` 클래스로 복구하여 투명 배경 및 점선 테두리(`border: 1px dashed`) 스타일 정상화
- **시세 카드 타이틀 간소화**:
  - `주요 시세 및 지수` ➔ `주요 시세`로 제목 단일화

## [1.5.1] - 2026-09-02

### 🛡️ 안정성 및 품질 강화 (Resilience & Tests)
- **파비콘 에러 방어 및 Fallback 고도화 (`LinksHub.tsx`)**:
  - 외부 파비콘 로딩 실패 시 깨진 이미지 엑스박스 대신 단정한 지구본/이니셜 대체 배지로 자동 전환
- **TDD 단위 테스트 스위트 전면 확장**:
  - `stockData.test.ts` (7대 시세 무결성 및 시장별 타임라인 검증)
  - `weatherService.test.ts` (기상 코드 매핑 및 지역 정합성 검증)
  - `useLocalStorage.test.ts` (스토리지 직렬화 및 상태 동기화 검증)
  - `urlHelper.test.ts` (URL 정규화 및 타이틀 추출 검증)
  - ➔ 총 18개 단위 테스트 100% Pass (Green) 달성

## [1.5.0] - 2026-09-02

### ✨ 신규 기능 (Feature)
- **바로가기 URL 우선 입력 & 웹페이지 제목 자동 가져오기**:
  - 바로가기 추가/수정 모달에서 웹사이트 주소(URL) 입력 필드를 1순위로 배치 및 자동 포커스
  - 주소 입력 시 실제 웹페이지의 HTML `<title>`을 비동기로 자동 조회하여 제목 칸에 자동 완성
  - 제목 조회 중 회전 스피너 애니메이션(`@keyframes spin`) 및 `✨ 자동 완성됨` 인디케이터 제공

## [1.4.1] - 2026-09-01

### 🎨 스타일 미세 조정 (Style)
- `dashboard-header` 좌우 내부 패딩(`padding: 8px 16px 12px 16px`)을 적용하여 타이틀 및 상태 텍스트의 여유 공간 확보

## [1.4.0] - 2026-09-01

### 🗑️ 기능 제거 및 최적화 (Cleanup)
- **배경 커스터마이징 기능 완전 삭제**:
  - 헤더의 '배경 설정' 버튼 및 아이콘 완전 제거
  - `BackgroundModal.tsx` 컴포넌트 및 배경 이미지 렌더링 레이어, 로컬스토리지 상태 관리 코드 전면 삭제
  - Saniti Light 본연의 정갈하고 가벼운 순수 대시보드로 복원

## [1.3.0] - 2026-09-01

### ✨ 디자인 및 UI 개선 (Design & UI)
- 날씨 카드 레이아웃 & 비주얼 밸런스 완성 (제목 '날씨' 간소화, 강수확률 수직 시선 흐름, 오늘 카드 위계 강조)
- 최저/최고 기온 명문화 (`최저 18° · 최고 26°`)
- 전역 기본 폰트 Google Noto Sans KR 100% 통일

## [1.2.0] - 2026-09-01

### ✨ 기능 개선 및 고도화 (Enhanced)
- 7대 주요 시세 시장별(한국/미국/24H가상자산) 특화 타임라인 분기 및 Trailing 롤링 날짜 적용
- 강수확률 차트 오늘 밤 실제 22시 단독 강조 및 세로 구분선 정밀 정렬

## [1.0.0] - 2026-09-01

### ✨ 최초 릴리즈 (Initial Release)
- 자주 가는 링크 5열 그리드 & 드래그 앤 드롭 순서 변경
- 전국 250+ 시군구 날씨 예보
- Saniti Light 디자인 시스템 적용
- 100vh 윈도우 무스크롤 고정 레이아웃
