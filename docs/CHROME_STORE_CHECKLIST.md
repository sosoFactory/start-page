# 📋 Chrome 웹스토어 등록 & 출시 체크리스트 (TODO)

Google Chrome 웹스토어(Chrome Web Store) 공식 확장 프로그램 등록 및 심사 통과를 위한 단계별 To-Do 리스트입니다.

---

## 1. 확장 프로그램 패키징 (Build & Package)

- [ ] **최종 프로덕션 빌드 실행**
  - `npm run build`
  - `dist` 디렉토리에 `manifest.json`, `index.html`, `popup.html`, `popup.js`, `icons/` 정상 포함 여부 확인
- [ ] **Manifest V3 설정 및 권한 최소화 검증**
  - 불필요한 과도한 권한 제거 (`storage`, `activeTab` 필수 권한만 유지)
  - `name`, `version` (`v1.22.0`), `description` 132자 이내 영문/한글 명확화
- [ ] **배포용 ZIP 압축 파일 생성**
  - `dist` 폴더 내부 파일들을 `startpage-dashboard-v1.22.0.zip`으로 아카이빙 (루트에 `manifest.json` 위치 필수)

---

## 2. 스토어 그래픽 에셋 준비 (Store Assets)

- [ ] **스토어 아이콘 점검**
  - `128x128px` PNG 파일 (`public/icons/icon128.png` 무손실 고화질 확인)
- [ ] **대시보드 홍보 스크린샷 캡처 (최소 1장 ~ 최대 5장)**
  - 규격: `1280x800px` 또는 `640x400px` PNG/JPEG
  - 1장: 메인 대시보드 전체 화면 (라이트 모드)
  - 2장: 메인 대시보드 전체 화면 (다크 모드)
  - 3장: 툴바 별(⭐) 아이콘 클릭 시 미니 팝업 1초 등록 화면
  - 4장: 오늘의 할 일 다중 탭 및 날씨 위젯 세부 화면
- [ ] **소형 프로모션 타일 (선택 권장)**
  - 규격: `440x280px` (스토어 검색 및 카테고리 추천 목록 노출용)

---

## 3. 스토어 설명문 및 정책 문서 (Listing Copy & Policy)

- [ ] **스토어 상세 설명문 (Listing Description)**
  - 확장 프로그램의 단일 목적(Single Purpose) 명시: "깔끔하고 빠른 데스크톱 시작 페이지 및 1초 북마크 관리"
  - 주요 기능 요약 (자주 가는 링크, 태그 클라우드, 할 일 다중 탭, 날씨/강수확률, 100% 로컬 저장)
  - 한국어 및 영문 텍스트 준비
- [ ] **개인정보처리방침 (Privacy Policy)**
  - 100% 로컬 스토리지(`localStorage`, `chrome.storage.local`) 보관 원칙
  - 외부 서버 데이터 수집 및 추적 제로(0%) 선언
  - GitHub Pages 또는 저장소 내 `docs/privacy-policy.md`로 공개 URL 확보
- [ ] **권한 소명서 작성 (Permission Justification)**
  - `storage`: "사용자의 북마크 링크, 할 일 목록, 다크모드 설정을 브라우저 로컬에 영속 저장하기 위함"
  - `activeTab`: "툴바 별(⭐) 아이콘 클릭 시 현재 열린 웹페이지의 URL과 제목을 시작화면 바로가기로 즉시 추가하기 위함"

---

## 4. Chrome 개발자 대시보드 업로드 및 심사 제출 (Submit)

- [ ] **Chrome 개발자 대시보드 로그인**: [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
- [ ] **1회성 개발자 등록비 결제** ($5 USD)
- [ ] **`[새 항목 추가]` ➔ `startpage-dashboard-v1.22.0.zip` 업로드**
- [ ] **스토어 등록정보 입력** (제목, 요약, 상세 설명, 카테고리: `생산성`)
- [ ] **그래픽 에셋 업로드** (아이콘, 1280x800 스크린샷)
- [ ] **개인정보보호 탭 입력** (단일 목적 선언, 권한 소명 작성, 개인정보처리방침 URL 등록)
- [ ] **최종 심사 제출 (Submit for Review)** (통상 1~3 영업일 소요)
