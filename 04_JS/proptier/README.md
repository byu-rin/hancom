# proptier

부동산 단지 정보 대시보드 (Real Estate Dashboard)
부동산 데이터를 검색하고 시각화하는 웹앱

## 프로젝트 목적

사용자가 주소 또는 아파트명을 검색하면 해당 단지의 정보를 한눈에 확인할 수 있는 웹 애플리케이션을 개발한다. 단순한 정보 조회를 넘어 거래 내역, 기본 정보, 즐겨찾기, 최근 검색 등을 제공하여 실제 부동산 정보 서비스를 축소 구현하는 것을 목표로 한다.

## 주요 기능

- **단지 검색**: 아파트명 또는 주소로 검색 (부분 검색, 대소문자 무시)
- **최근 검색어**: 최대 10개, 중복 제거, 최신순 유지, 새로고침 후에도 유지(LocalStorage)
- **즐겨찾기**: 단지 카드에서 즐겨찾기 토글, 새로고침 후에도 유지(LocalStorage)
- **거래내역 Accordion**: 검색 결과 카드를 클릭하면 카드 바로 아래에 해당 단지의 거래내역이 펼쳐짐 (한 번에 하나만 열림, 같은 카드 재클릭 시 닫힘)

## 기술 스택

- HTML / CSS / JavaScript
- Fetch API를 통한 외부 데이터 통신
- DOM 동적 생성 및 이벤트 처리
- LocalStorage 활용
- 반응형 UI 구현
- 모듈 시스템 없이 `<script>` 태그 로드 순서로 전역 스코프를 공유하는 구조

## 아키텍처

Provider Pattern을 사용해 Mock 데이터와 실제 API를 교체 가능하도록 설계했습니다.

```
UI (ui.js)
  ↓ 직접 호출
Service (service.js)  ─ SearchService / RecentSearchService / FavoriteService / ApartmentDetailService
  ↓
Provider (mockProvider.js ↔ apiProvider.js)  ─ 동일한 인터페이스: searchApartment / getApartment / getDeals
  ↓
Storage (storage.js)  ─ save / load / remove / clear / exists (LocalStorage 래퍼)
```

- UI는 Storage를 직접 호출하지 않고 반드시 Service를 거칩니다.
- 현재는 `service.js`의 `activeProvider = mockProvider` 한 줄로 Mock Provider가 활성화되어 있습니다. 실제 API로 전환하려면 `apiProvider.js`를 구현하고 이 한 줄만 교체하면 됩니다(`apiProvider.js`는 아직 TODO 상태의 스텁입니다).
- 거래내역(`deals.json`)은 `apartmentId`로 단지(`apartments.json`의 `id`)와 연결됩니다.

## 폴더 구조

```
proptier/
├── index.html          # 진입 HTML, 스크립트 로드 순서 정의
├── app.js               # SPA 진입점 (#search-app에 UI 초기화)
├── ui.js                 # 렌더링 + 사용자 입력 처리 (UI 레이어)
├── service.js            # 비즈니스 로직 (Search/RecentSearch/Favorite/ApartmentDetail Service)
├── mockProvider.js        # JSON Mock 데이터셋 기반 Provider
├── apiProvider.js         # 실제 API Provider
├── storage.js            # LocalStorage 래퍼
├── harness.js             # 기능별 자체 검증 테스트 모음
├── data/
│   ├── apartments.json    # 단지 정보 100건
│   └── deals.json         # 거래내역 50건
└── css/
    └── style.css          # 파스텔 톤 카드 UI 스타일
```

## 실행 방법

⚠️ **반드시 로컬 서버로 실행해야 합니다.** `index.html`을 `file://`로 직접 열면 `fetch()`가 브라우저 CORS 정책에 막혀 데이터가 로드되지 않습니다.

```bash
# proptier 폴더에서 실행
npx serve .
# 또는
python -m http.server 8000
```

서버 실행 후 안내되는 주소(예: `http://localhost:3000`)로 접속합니다.

## 테스트 (Harness)

별도의 테스트 프레임워크 없이, `harness.js`에 기능별 자체 검증 코드를 작성해 두었습니다. 앱 로드 시 자동으로 실행되며, 브라우저 개발자 도구 콘솔에서 결과를 확인할 수 있습니다.

- `[PASS]` / `[FAIL]`: 개별 조건 검증 결과
- `PASS`: 하나의 테스트가 모든 조건을 통과했을 때 출력

검증 항목: LocalStorage(save/load/remove/clear/exists), 최근 검색어, 즐겨찾기, 단지 검색(이름/주소/부분/대소문자), JSON fetch 연동, 검색 UI 연결, 단지 선택 → 거래내역 연결, 디자인 요소(스타일 로드/Hover/선택 표시), Accordion 동작(펼침/닫힘/다른 카드 클릭 시 전환).
