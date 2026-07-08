/**
 * ui.js
 *
 * 화면 렌더링 및 사용자 입력 처리를 담당하는 UI 레이어.
 * Storage를 직접 호출하지 않으며, 반드시 service.js를 통해서만
 * 데이터를 주고받는다.
 */

/**
 * initSearchApp
 * 검색창, 최근 검색어 목록, 검색 결과, 단지 상세 영역을 root에 렌더링하고
 * SearchService / RecentSearchService / FavoriteService / ApartmentDetailService와 연결한다.
 * @param {HTMLElement} root - UI를 렌더링할 최상위 컨테이너
 */
function initSearchApp(root) {
  const { searchInput, searchButton } = createSearchControls();
  const { recentListContainer, resultContainer, detailContainer } = createSearchContainers();

  const showApartmentDetail = async (id) => {
    const { apartment, deals } = await ApartmentDetailService.getDetail(id);
    detailContainer.innerHTML = "";
    detailContainer.appendChild(renderApartmentDetail(apartment, deals));
  };

  const runSearch = async (keyword) => {
    const apartments = await SearchService.search(keyword);
    resultContainer.innerHTML = "";
    resultContainer.appendChild(renderSearchResult(apartments, showApartmentDetail));
    detailContainer.innerHTML = "";
  };

  const refreshRecentList = () => {
    recentListContainer.innerHTML = "";
    recentListContainer.appendChild(renderRecentSearchList(RecentSearchService.getAll(), runSearch));
  };

  searchButton.addEventListener("click", () => {
    const keyword = searchInput.value;
    RecentSearchService.add(keyword);
    runSearch(keyword);
    refreshRecentList();
  });

  root.appendChild(searchInput);
  root.appendChild(searchButton);
  root.appendChild(recentListContainer);
  root.appendChild(resultContainer);
  root.appendChild(detailContainer);

  refreshRecentList();
}

/**
 * renderApartmentCard
 * 단지 정보 객체 하나를 받아 카드 형태의 DOM 엘리먼트를 생성한다.
 * onSelect가 주어지면 카드(즐겨찾기 버튼 제외) 클릭 시 단지 id와 함께 호출한다.
 * @param {{id: number, aptName: string, address: string, buildYear: number, households: number, maxFloor: number}} apartment - 단지 정보
 * @param {function(number): void} [onSelect] - 카드 클릭 시 실행할 콜백 (선택)
 * @returns {HTMLElement} 단지 카드 엘리먼트
 */
function renderApartmentCard(apartment, onSelect) {
  const card = document.createElement("div");
  card.className = "apartment-card";

  const title = document.createElement("h3");
  title.textContent = apartment.aptName;

  const address = document.createElement("p");
  address.textContent = apartment.address;

  const info = document.createElement("p");
  info.textContent = `${apartment.buildYear}년 준공 / ${apartment.households}세대 / 최고 ${apartment.maxFloor}층`;

  card.appendChild(title);
  card.appendChild(address);
  card.appendChild(info);
  card.appendChild(createFavoriteButton(apartment));

  if (onSelect) {
    card.addEventListener("click", () => onSelect(apartment.id));
  }

  return card;
}

/**
 * createFavoriteButton
 * 즐겨찾기 토글 버튼을 생성한다. 클릭 시 FavoriteService.toggle()을 호출하고,
 * 즐겨찾기 여부에 따라 버튼 텍스트/클래스 상태를 갱신한다.
 * @param {Object} apartment - id를 포함한 아파트 객체
 * @returns {HTMLElement} 즐겨찾기 버튼 엘리먼트
 */
function createFavoriteButton(apartment) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-button";

  const updateState = (isFavorite) => {
    button.textContent = isFavorite ? "★ 즐겨찾기됨" : "☆ 즐겨찾기";
    button.classList.toggle("is-favorite", isFavorite);
  };

  updateState(FavoriteService.isFavorite(apartment.id));

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    FavoriteService.toggle(apartment);
    updateState(FavoriteService.isFavorite(apartment.id));
  });

  return button;
}

/**
 * renderDealTable
 * 실거래가 목록을 받아 테이블 형태의 DOM 엘리먼트를 생성한다.
 * @param {Array<{dealDate: string, price: number, exclusiveArea: number, floor: number}>} deals - 실거래가 목록
 * @returns {HTMLElement} 실거래가 테이블 엘리먼트
 */
function renderDealTable(deals) {
  const table = document.createElement("table");
  table.className = "deal-table";

  const headerRow = document.createElement("tr");
  ["계약일", "가격(만원)", "전용면적(㎡)", "층"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  deals.forEach((deal) => {
    const row = document.createElement("tr");
    [
      deal.dealDate,
      deal.price.toLocaleString(),
      deal.exclusiveArea,
      deal.floor,
    ].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  return table;
}

/**
 * renderSearchResult
 * 검색된 아파트 목록을 받아 카드들을 감싸는 컨테이너 엘리먼트를 생성한다.
 * @param {Array<Object>} apartments - renderApartmentCard에 전달할 아파트 목록
 * @param {function(number): void} [onSelect] - 카드 클릭 시 실행할 콜백 (선택)
 * @returns {HTMLElement} 검색 결과 컨테이너 엘리먼트
 */
function renderSearchResult(apartments, onSelect) {
  const container = document.createElement("div");
  container.className = "search-result";

  if (apartments.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "검색 결과가 없습니다.";
    container.appendChild(empty);
    return container;
  }

  apartments.forEach((apartment) => {
    container.appendChild(renderApartmentCard(apartment, onSelect));
  });

  return container;
}

/**
 * renderApartmentDetail
 * 선택된 단지의 정보와 거래내역을 함께 렌더링하는 상세 영역 엘리먼트를 생성한다.
 * @param {Object|null} apartment - 단지 정보. 없으면 안내 문구를 표시한다.
 * @param {Array<Object>} deals - apartmentId로 연결된 거래내역 목록
 * @returns {HTMLElement} 단지 상세 컨테이너 엘리먼트
 */
function renderApartmentDetail(apartment, deals) {
  const container = document.createElement("div");
  container.className = "apartment-detail";

  if (!apartment) {
    const empty = document.createElement("p");
    empty.textContent = "단지 정보를 찾을 수 없습니다.";
    container.appendChild(empty);
    return container;
  }

  container.appendChild(renderApartmentCard(apartment));
  container.appendChild(renderDealTable(deals));

  return container;
}

/**
 * renderRecentSearchList
 * 최근 검색어 목록을 클릭 가능한 리스트로 렌더링한다.
 * 항목 클릭 시 onSelect 콜백을 통해 SearchService.search()가 실행되도록 한다.
 * @param {Array<string>} keywords - 최근 검색어 목록
 * @param {function(string): void} onSelect - 검색어 클릭 시 실행할 콜백
 * @returns {HTMLElement} 최근 검색어 리스트 엘리먼트
 */
function renderRecentSearchList(keywords, onSelect) {
  const list = document.createElement("ul");
  list.className = "recent-search-list";

  if (keywords.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "최근 검색어가 없습니다.";
    list.appendChild(empty);
    return list;
  }

  keywords.forEach((keyword) => {
    const item = document.createElement("li");
    item.className = "recent-search-item";
    item.textContent = keyword;
    item.addEventListener("click", () => onSelect(keyword));
    list.appendChild(item);
  });

  return list;
}

/**
 * createSearchControls
 * 검색 입력창과 검색 버튼 엘리먼트를 생성한다.
 * @returns {{searchInput: HTMLElement, searchButton: HTMLElement}} 검색 컨트롤 엘리먼트
 */
function createSearchControls() {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "search-input";
  searchInput.placeholder = "아파트 이름 검색";

  const searchButton = document.createElement("button");
  searchButton.type = "button";
  searchButton.className = "search-button";
  searchButton.textContent = "검색";

  return { searchInput, searchButton };
}

/**
 * createSearchContainers
 * 최근 검색어, 검색 결과, 단지 상세를 표시할 컨테이너 엘리먼트를 생성한다.
 * @returns {{recentListContainer: HTMLElement, resultContainer: HTMLElement, detailContainer: HTMLElement}} 컨테이너 엘리먼트
 */
function createSearchContainers() {
  const recentListContainer = document.createElement("div");
  recentListContainer.className = "recent-search-container";

  const resultContainer = document.createElement("div");
  resultContainer.className = "search-result-container";

  const detailContainer = document.createElement("div");
  detailContainer.className = "apartment-detail-container";

  return { recentListContainer, resultContainer, detailContainer };
}
