# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(62% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 기능 요구사항: 북마크 버튼 그룹화 및 데이터 모델 간소화

### 2.1 북마크 데이터 모델 간소화 (`category` 필드 완전 제거)
- **배경**: 초기 기획의 분류용 `category` 속성이 현재 UI에서 사용되지 않고 단순 기본값(`all`)으로만 남아있어 데이터가 불필요하게 비대해지는 문제 발생.
- **변경 사항**:
  - `BookmarkLink` 데이터 구조에서 `category` 필드를 완전히 제거.
  - 필수 핵심 속성 3개(`id`, `title`, `url`)로만 모델을 경량화.
  - JSON 내보내기 및 가져오기 시에도 `id`, `title`, `url` 3개 필드만 깔끔하게 입출력되도록 정돈.
  - 대상 파일: `presetLinks.ts`, `BookmarkModal.tsx`, `LinksHub.tsx`, `public/popup.js`.

### 2.2 내보내기/가져오기 버튼 그룹(`btn-group`) UI 개선
- **배경**: `[내보내기]`와 `[가져오기]`가 개별 버튼으로 나뉘어 있어 시각적 분산이 발생함.
- **변경 사항**:
  - 두 버튼을 하나의 테두리와 배경을 공유하는 **버튼 그룹(Button Group / Segmented Control)** 스타일로 통합.
  - `[ ⬇ 내보내기 | ⬆ 가져오기 ]` 형태로 좌우 결합 및 중간 얇은 구분선 배치.
  - hover 시 각 버튼 영역별 부드러운 배경색 전환 피드백 제공.
  - 버튼 그룹 우측에 적절한 간격으로 `[+ 바로가기 추가]` 강조 버튼 배치.

---

## 3. 진행 계획
1. **PRD 작성 및 사용자 승인** (현재 단계)
2. **데이터 모델 및 컴포넌트 수정**:
   - `src/data/presetLinks.ts`: `category` 필드 제거
   - `src/components/BookmarkModal.tsx`: 저장 데이터에서 `category` 제거
   - `src/components/LinksHub.tsx`: 내보내기/가져오기 데이터에서 `category` 제거 및 `btn-group` 마크업 적용
   - `public/popup.js`: 추가 링크 및 기본 프리셋에서 `category` 제거
3. **스타일링 (`src/styles/app.css`)**:
   - `.btn-group` 컨테이너 및 세그먼트 버튼 CSS 추가
4. **테스트 및 빌드 검증**:
   - `npm test` 및 `npm run build` 검증 
