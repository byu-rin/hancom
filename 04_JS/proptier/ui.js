/**
 * ui.js
 *
 * 화면 렌더링 및 사용자 입력 처리를 담당하는 UI 레이어.
 * Storage를 직접 호출하지 않으며, 반드시 service.js를 통해서만
 * 데이터를 주고받는다.
 */

/** @type {string} 검색 입력창 placeholder 문구 */
const SEARCH_INPUT_PLACEHOLDER = "아파트 이름 검색";

/** @type {string} 검색 버튼 라벨 */
const SEARCH_BUTTON_LABEL = "검색";

/** @type {string} 검색 결과가 없을 때 표시할 문구 */
const EMPTY_RESULT_MESSAGE = "검색 결과가 없습니다.";

/** @type {string} 최근 검색어가 없을 때 표시할 문구 */
const EMPTY_RECENT_MESSAGE = "최근 검색어가 없습니다.";

/** @type {string} 단지 정보를 찾지 못했을 때 표시할 문구 */
const EMPTY_DETAIL_MESSAGE = "단지 정보를 찾을 수 없습니다.";

/** @type {string} 즐겨찾기 버튼의 '즐겨찾기됨' 라벨 */
const FAVORITE_ON_LABEL = "★ 즐겨찾기됨";

/** @type {string} 즐겨찾기 버튼의 '즐겨찾기 안 됨' 라벨 */
const FAVORITE_OFF_LABEL = "☆ 즐겨찾기";

/** @type {Array<string>} 거래내역 테이블 헤더 라벨 (계약일/가격/전용면적/층 순서) */
const DEAL_TABLE_HEADERS = ["계약일", "가격(만원)", "전용면적(㎡)", "층"];

/**
 * createStyledElement
 * 지정한 태그의 엘리먼트를 생성하고 className/textContent를 함께 적용한다.
 * "createElement → className 설정 → textContent 설정"이 반복되는 패턴을 통합한다.
 * @param {string} tag - 생성할 태그명
 * @param {string} [className] - 적용할 class (선택)
 * @param {string} [text] - 설정할 textContent (선택)
 * @returns {HTMLElement} 생성된 엘리먼트
 */
function createStyledElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/**
 * initSearchApp
 * 검색창, 최근 검색어 목록, 검색 결과(Accordion) 영역을 root에 렌더링하고
 * SearchService / RecentSearchService / FavoriteService / ApartmentDetailService와 연결한다.
 * 단지 정보/거래내역은 더 이상 별도 하단 영역이 아니라, 클릭한 카드 아래에 Accordion으로 펼쳐진다.
 * @param {HTMLElement} root - UI를 렌더링할 최상위 컨테이너
 */
function initSearchApp(root) {
  const { searchInput, searchButton } = createSearchControls();
  const { recentListContainer, resultContainer } = createSearchContainers();

  const runSearch = async (keyword) => {
    const apartments = await SearchService.search(keyword);
    resultContainer.innerHTML = "";
    resultContainer.appendChild(renderSearchResult(apartments));
  };

  const refreshRecentList = () => {
    recentListContainer.innerHTML = "";
    recentListContainer.appendChild(
      renderRecentSearchList(RecentSearchService.getAll(), runSearch),
    );
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
  const card = createStyledElement("div", "apartment-card");
  const title = createStyledElement("h3", undefined, apartment.aptName);
  const address = createStyledElement("p", undefined, apartment.address);
  const info = createStyledElement(
    "p",
    undefined,
    `${apartment.buildYear}년 준공 / ${apartment.households}세대 / 최고 ${apartment.maxFloor}층`,
  );

  card.appendChild(title);
  card.appendChild(address);
  card.appendChild(info);
  card.appendChild(createFavoriteButton(apartment));

  if (onSelect) {
    card.classList.add("clickable");
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
  const button = createStyledElement("button", "favorite-button");
  button.type = "button";

  const updateState = (isFavorite) => {
    button.textContent = isFavorite ? FAVORITE_ON_LABEL : FAVORITE_OFF_LABEL;
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
  const table = createStyledElement("table", "deal-table");

  const headerRow = document.createElement("tr");
  DEAL_TABLE_HEADERS.forEach((label) => {
    headerRow.appendChild(createStyledElement("th", undefined, label));
  });
  table.appendChild(headerRow);

  deals.forEach((deal) => {
    const row = document.createElement("tr");
    [deal.dealDate, deal.price.toLocaleString(), deal.exclusiveArea, deal.floor].forEach((value) => {
      row.appendChild(createStyledElement("td", undefined, value));
    });
    table.appendChild(row);
  });

  return table;
}

/**
 * renderSearchResult
 * 검색된 단지 목록을 Accordion 카드 목록으로 렌더링한다. 카드를 클릭하면 카드
 * 바로 아래에 단지 정보와 거래내역이 함께 펼쳐지고(Accordion), 다른 카드를
 * 클릭하면 이전에 열린 카드는 닫히며 새 카드만 열린다. 같은 카드를 다시
 * 클릭하면 닫힌다.
 * @param {Array<Object>} apartments - 검색된 단지 목록
 * @returns {HTMLElement} 검색 결과 컨테이너 엘리먼트
 */
function renderSearchResult(apartments) {
  const container = createStyledElement("div", "search-result");

  if (apartments.length === 0) {
    container.appendChild(createStyledElement("p", "empty-message", EMPTY_RESULT_MESSAGE));
    return container;
  }

  const accordionState = { openItem: null };
  apartments.forEach((apartment) => {
    container.appendChild(createAccordionItem(apartment, accordionState));
  });

  return container;
}

/**
 * createAccordionItem
 * 단지 카드와 그 카드에 대응하는 Accordion 패널(단지 정보 + 거래내역)을
 * 함께 감싸는 결과 항목을 생성한다. 실제 펼침/닫힘 동작은 toggleAccordion이 담당한다.
 * @param {Object} apartment - 단지 정보
 * @param {{openItem: {card: HTMLElement, panel: HTMLElement}|null}} accordionState - 열려 있는 항목을 추적하는 공유 상태
 * @returns {HTMLElement} 결과 항목(카드 + Accordion 패널) 엘리먼트
 */
function createAccordionItem(apartment, accordionState) {
  const wrapper = createStyledElement("div", "result-item");
  const panel = createStyledElement("div", "accordion-panel");

  // renderApartmentCard 호출 시점에 card를 아직 대입하지 못하므로 let으로 먼저
  // 선언한다. 클릭 콜백은 이후(비동기)에 실행되므로 그 시점엔 card가 채워져 있다.
  let card;
  card = renderApartmentCard(apartment, () =>
    toggleAccordion(apartment, card, panel, accordionState),
  );

  wrapper.appendChild(card);
  wrapper.appendChild(panel);

  return wrapper;
}

/**
 * toggleAccordion
 * 카드를 클릭했을 때 Accordion을 펼치거나 닫는다. 이미 열려 있는 카드를 다시
 * 클릭하면 닫고, 다른 카드를 클릭하면 이전 카드를 닫은 뒤 새 카드를 연다.
 * 패널 내용은 ApartmentDetailService.getDetail()로 최초 펼침 시 한 번만 채운다.
 * @param {Object} apartment - 단지 정보
 * @param {HTMLElement} card - 클릭된 단지 카드 엘리먼트
 * @param {HTMLElement} panel - 카드에 대응하는 Accordion 패널 엘리먼트
 * @param {{openItem: {card: HTMLElement, panel: HTMLElement}|null}} accordionState - 열려 있는 항목을 추적하는 공유 상태
 */
async function toggleAccordion(apartment, card, panel, accordionState) {
  const wasOpen =
    accordionState.openItem && accordionState.openItem.card === card;

  if (accordionState.openItem) {
    accordionState.openItem.card.classList.remove("selected");
    accordionState.openItem.panel.classList.remove("open");
    accordionState.openItem = null;
  }

  if (wasOpen) return;

  if (panel.children.length === 0) {
    const { apartment: detailApartment, deals } =
      await ApartmentDetailService.getDetail(apartment.id);
    panel.appendChild(renderApartmentDetail(detailApartment, deals));
  }

  card.classList.add("selected");
  panel.classList.add("open");
  accordionState.openItem = { card, panel };
}

/**
 * renderApartmentDetail
 * 선택된 단지의 정보와 거래내역을 함께 렌더링하는 상세 영역 엘리먼트를 생성한다.
 * @param {Object|null} apartment - 단지 정보. 없으면 안내 문구를 표시한다.
 * @param {Array<Object>} deals - apartmentId로 연결된 거래내역 목록
 * @returns {HTMLElement} 단지 상세 컨테이너 엘리먼트
 */
function renderApartmentDetail(apartment, deals) {
  const container = createStyledElement("div", "apartment-detail");

  if (!apartment) {
    container.appendChild(createStyledElement("p", "empty-message", EMPTY_DETAIL_MESSAGE));
    return container;
  }

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
  const list = createStyledElement("ul", "recent-search-list");

  if (keywords.length === 0) {
    list.appendChild(createStyledElement("li", "empty-message", EMPTY_RECENT_MESSAGE));
    return list;
  }

  keywords.forEach((keyword) => {
    const item = createStyledElement("li", "recent-search-item", keyword);
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
  const searchInput = createStyledElement("input", "search-input");
  searchInput.type = "text";
  searchInput.placeholder = SEARCH_INPUT_PLACEHOLDER;

  const searchButton = createStyledElement("button", "search-button", SEARCH_BUTTON_LABEL);
  searchButton.type = "button";

  return { searchInput, searchButton };
}

/**
 * createSearchContainers
 * 최근 검색어, 검색 결과(Accordion)를 표시할 컨테이너 엘리먼트를 생성한다.
 * 단지 정보/거래내역은 더 이상 별도 컨테이너가 아니라 각 결과 카드 내부의
 * Accordion 패널에 표시되므로 별도 detailContainer는 사용하지 않는다.
 * @returns {{recentListContainer: HTMLElement, resultContainer: HTMLElement}} 컨테이너 엘리먼트
 */
function createSearchContainers() {
  const recentListContainer = createStyledElement("div", "recent-search-container");
  const resultContainer = createStyledElement("div", "search-result-container");

  return { recentListContainer, resultContainer };
}
