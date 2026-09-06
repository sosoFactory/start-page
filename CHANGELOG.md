# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 이 문서에 기록됩니다.
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

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
  - [방법 1] GitHub Pages 웹 주소(`https://haksoo0918.github.io/start-page/`)를 통한 브라우저 홈 설정 가이드 및 GitHub Pages 1회 활성화 단계별 안내
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
