/**
 * harness.js
 *
 * 기능 구현 전에 먼저 작성하는 테스트/검증(Harness) 코드 모음.
 * 각 기능을 추가하기 전, 이 파일에 해당 기능의 기대 동작을
 * 검증하는 테스트 케이스를 먼저 작성한다.
 */

/**
 * runUiHarness
 * mockProvider를 통해 JSON Mock 데이터셋(fetch)을 읽어와 ui.js의
 * renderApartmentCard, renderDealTable, renderSearchResult를 #app 컨테이너에 렌더링한다.
 */
async function runUiHarness() {
  const app = document.getElementById('app');
  if (!app) return;

  const apartments = await mockProvider.searchApartment('');
  if (apartments.length === 0) return;

  const firstApartment = apartments[0];
  const deals = await mockProvider.getDeals(firstApartment.id);

  const cardSection = document.createElement('section');
  cardSection.appendChild(renderApartmentCard(firstApartment));
  app.appendChild(cardSection);

  const tableSection = document.createElement('section');
  tableSection.appendChild(renderDealTable(deals));
  app.appendChild(tableSection);

  const resultSection = document.createElement('section');
  resultSection.appendChild(renderSearchResult(apartments.slice(0, 5)));
  app.appendChild(resultSection);

  console.log('[harness] JSON Mock 데이터 렌더링 완료: renderApartmentCard, renderDealTable, renderSearchResult');
}

window.addEventListener('DOMContentLoaded', runUiHarness);

/**
 * assert
 * 조건을 검증하고 결과를 console에 기록하는 Harness 유틸리티.
 * @param {boolean} condition - 검증할 조건
 * @param {string} message - 검증 내용을 설명하는 문구
 */
function assert(condition, message) {
  console.log(`${condition ? '[PASS]' : '[FAIL]'} ${message}`);
}

/**
 * runSearchServiceHarness
 * SearchService.search를 mockProvider의 JSON 데이터셋 기준으로 검증한다.
 * UI는 사용하지 않고 결과를 console에만 출력한다.
 */
async function runSearchServiceHarness() {
  const all = await SearchService.search('');
  assert(all.length === 100, `빈 검색어 → 전체 ${all.length}건 반환 (기대값 100)`);

  const target = all[0];
  const exact = await SearchService.search(target.aptName);
  assert(exact.some((apt) => apt.id === target.id), `'${target.aptName}' 검색 → 대상 단지 포함`);

  const none = await SearchService.search('존재하지않는검색어__xyz');
  assert(none.length === 0, '존재하지 않는 검색어 → 빈 배열 반환');
}

window.addEventListener('DOMContentLoaded', runSearchServiceHarness);

/**
 * testSearchApartmentCriteria
 * SearchService.search() → mockProvider.searchApartment() → apartments.json 검색
 * 흐름이 이름 검색/주소 검색/부분 검색/대소문자 무시를 모두 지원하는지 검증한다.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
async function testSearchApartmentCriteria() {
  const results = [];
  const all = await SearchService.search('');
  const target = all[0];

  const byFullName = await SearchService.search(target.aptName);
  results.push(byFullName.some((apt) => apt.id === target.id));

  const addressToken = target.address.split(' ')[1];
  const byAddress = await SearchService.search(addressToken);
  results.push(byAddress.some((apt) => apt.id === target.id));

  const partialKeyword = target.aptName.slice(0, Math.ceil(target.aptName.length / 2));
  const byPartial = await SearchService.search(partialKeyword);
  results.push(byPartial.some((apt) => apt.id === target.id));

  const englishApt = all.find((apt) => /[a-zA-Z]/.test(apt.aptName));
  if (englishApt) {
    const byLower = await SearchService.search(englishApt.aptName.toLowerCase());
    const byUpper = await SearchService.search(englishApt.aptName.toUpperCase());
    results.push(byLower.some((apt) => apt.id === englishApt.id));
    results.push(byUpper.some((apt) => apt.id === englishApt.id));
  }

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testSearchApartmentCriteria: 이름/주소/부분/대소문자 검색 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

window.addEventListener('DOMContentLoaded', testSearchApartmentCriteria);

/**
 * testMockProviderData
 * mockProvider가 apartments.json/deals.json을 fetch로 정상적으로 읽어와
 * searchApartment/getApartment/getDeals를 올바르게 수행하는지 검증한다.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
async function testMockProviderData() {
  const results = [];

  const apartments = await mockProvider.searchApartment('');
  results.push(Array.isArray(apartments) && apartments.length === 100);

  const first = apartments[0];
  results.push(!!first && typeof first.aptName === 'string');

  const found = await mockProvider.getApartment(first.id);
  results.push(!!found && found.id === first.id);

  const deals = await mockProvider.getDeals(first.id);
  results.push(Array.isArray(deals) && deals.every((deal) => deal.apartmentId === first.id));

  const dealsResponse = await fetch('./data/deals.json');
  const allDeals = await dealsResponse.json();
  results.push(Array.isArray(allDeals) && allDeals.length === 50);

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testMockProviderData: JSON fetch/검색/조회/거래내역 연결 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

window.addEventListener('DOMContentLoaded', testMockProviderData);

/**
 * testStorage
 * storage.js의 save/load/remove/clear/exists를 검증하는 Harness.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
function testStorage() {
  const key = '__harness_storage_test__';
  const value = { name: '테스트', count: 1 };
  const results = [];

  results.push(save(key, value) === true);
  results.push(JSON.stringify(load(key)) === JSON.stringify(value));
  results.push(exists(key) === true);

  remove(key);
  results.push(load(key) === null);
  results.push(exists(key) === false);

  save(key, 'temp');
  clear(key);
  results.push(load(key) === null);

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testStorage: 저장/조회/삭제/초기화/존재여부 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

window.addEventListener('DOMContentLoaded', testStorage);

/**
 * testRecentSearch
 * RecentSearchService의 add/getAll/remove/clear를 검증하는 Harness.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
function testRecentSearch() {
  const results = [];
  RecentSearchService.clear();

  RecentSearchService.add('   ');
  results.push(RecentSearchService.getAll().length === 0);

  RecentSearchService.add('강남구');
  RecentSearchService.add('서초구');
  RecentSearchService.add('강남구');
  const afterDuplicate = RecentSearchService.getAll();
  results.push(afterDuplicate.length === 2);
  results.push(afterDuplicate[0] === '강남구');

  for (let i = 0; i < 15; i += 1) {
    RecentSearchService.add(`검색어${i}`);
  }
  const afterMany = RecentSearchService.getAll();
  results.push(afterMany.length === MAX_RECENT_SEARCHES);
  results.push(afterMany[0] === '검색어14');

  RecentSearchService.remove('검색어14');
  results.push(!RecentSearchService.getAll().includes('검색어14'));

  RecentSearchService.clear();
  results.push(RecentSearchService.getAll().length === 0);

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testRecentSearch: 저장/중복제거/최대개수/삭제/초기화 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

window.addEventListener('DOMContentLoaded', testRecentSearch);

/**
 * testFavorite
 * FavoriteService의 add/remove/toggle/getAll/isFavorite를 검증하는 Harness.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
function testFavorite() {
  const results = [];
  const testApt = { id: '__harness_favorite_test__', name: '테스트아파트', dong: '101', area: 84.5, floor: 5, price: 90000 };

  FavoriteService.remove(testApt.id);

  const afterAdd = FavoriteService.add(testApt);
  results.push(afterAdd.some((apt) => apt.id === testApt.id));
  results.push(FavoriteService.isFavorite(testApt.id) === true);

  const afterDuplicateAdd = FavoriteService.add(testApt);
  results.push(afterDuplicateAdd.filter((apt) => apt.id === testApt.id).length === 1);

  const afterToggleOff = FavoriteService.toggle(testApt);
  results.push(!afterToggleOff.some((apt) => apt.id === testApt.id));
  results.push(FavoriteService.isFavorite(testApt.id) === false);

  const afterToggleOn = FavoriteService.toggle(testApt);
  results.push(afterToggleOn.some((apt) => apt.id === testApt.id));

  const reloaded = FavoriteService.getAll().find((apt) => apt.id === testApt.id);
  results.push(JSON.stringify(reloaded) === JSON.stringify(testApt));

  FavoriteService.remove(testApt.id);
  results.push(!FavoriteService.isFavorite(testApt.id));

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testFavorite: 추가/삭제/토글/중복방지/유지 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

window.addEventListener('DOMContentLoaded', testFavorite);

/**
 * resetUiWiringState
 * testUiServiceWiring 실행 전/후 최근 검색어와 즐겨찾기를 빈 상태로 되돌린다.
 */
function resetUiWiringState() {
  RecentSearchService.clear();
  FavoriteService.getAll().forEach((apartment) => FavoriteService.remove(apartment.id));
}

/**
 * wait
 * 지정한 밀리초만큼 대기하는 Promise를 반환한다. fetch 기반 비동기 검색이
 * 완료될 시간을 확보하기 위해 Harness 테스트에서 사용한다.
 * @param {number} ms - 대기할 밀리초
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * performSearch
 * 검색창에 키워드를 입력하고 검색 버튼을 클릭한 뒤, 비동기 검색이
 * 완료될 때까지 대기한다.
 * @param {HTMLElement} input - 검색 입력창
 * @param {HTMLElement} button - 검색 버튼
 * @param {string} keyword - 입력할 검색어
 * @returns {Promise<void>}
 */
async function performSearch(input, button, keyword) {
  input.value = keyword;
  button.click();
  await wait(100);
}

/**
 * testUiServiceWiring
 * ui.js의 initSearchApp이 SearchService/RecentSearchService/FavoriteService와
 * 올바르게 연결되어 있는지 검증하는 Harness. 모든 항목이 통과하면 'PASS'를 출력한다.
 */
async function testUiServiceWiring() {
  const results = [];
  resetUiWiringState();

  const apartments = await mockProvider.searchApartment('');
  const [firstApt, secondApt] = apartments;

  const container = document.createElement('div');
  initSearchApp(container);
  const input = container.querySelector('.search-input');
  const button = container.querySelector('.search-button');

  await performSearch(input, button, firstApt.aptName);
  results.push(RecentSearchService.getAll()[0] === firstApt.aptName);
  results.push(container.querySelectorAll('.apartment-card').length > 0);

  await performSearch(input, button, secondApt.aptName);
  const recentItems = Array.from(container.querySelectorAll('.recent-search-item'));
  const firstItem = recentItems.find((item) => item.textContent === firstApt.aptName);
  firstItem.click();
  await wait(100);
  const titles = container.querySelectorAll('.apartment-card h3');
  results.push(titles.length > 0 && titles[0].textContent === firstApt.aptName);

  const favoriteButton = container.querySelector('.favorite-button');
  const beforeText = favoriteButton.textContent;
  favoriteButton.click();
  results.push(favoriteButton.textContent !== beforeText);
  results.push(favoriteButton.classList.contains('is-favorite'));

  resetUiWiringState();

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testUiServiceWiring: 검색/최근검색 클릭/즐겨찾기 UI 연결 확인');
  if (allPassed) {
    console.log('PASS');
  }
}


/**
 * findApartmentWithDeals
 * 거래내역이 1건 이상 연결된 단지를 순서대로 찾는다.
 * @param {Array<Object>} apartments - 검색할 단지 목록
 * @returns {Promise<Object|null>} 거래내역이 있는 단지. 없으면 null
 */
async function findApartmentWithDeals(apartments) {
  for (const apartment of apartments) {
    const deals = await mockProvider.getDeals(apartment.id);
    if (deals.length > 0) return apartment;
  }
  return null;
}

/**
 * testApartmentDetailWiring
 * 검색 결과 카드 클릭 시 getApartment()/getDeals()를 통해 단지 정보와
 * apartmentId로 연결된 거래내역이 상세 영역에 함께 렌더링되는지 검증한다.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
async function testApartmentDetailWiring() {
  const results = [];
  resetUiWiringState();

  const apartments = await mockProvider.searchApartment('');
  const targetApt = await findApartmentWithDeals(apartments);
  if (!targetApt) {
    assert(false, 'testApartmentDetailWiring: 거래내역이 있는 단지를 찾지 못함');
    return;
  }

  const container = document.createElement('div');
  initSearchApp(container);
  const input = container.querySelector('.search-input');
  const button = container.querySelector('.search-button');

  await performSearch(input, button, targetApt.aptName);
  const card = container.querySelector('.apartment-card');
  card.click();
  await wait(100);

  const detail = container.querySelector('.apartment-detail');
  results.push(!!detail);

  const detailTitle = detail ? detail.querySelector('h3') : null;
  results.push(!!detailTitle && detailTitle.textContent === targetApt.aptName);

  const expectedDeals = await mockProvider.getDeals(targetApt.id);
  const dealRows = detail ? detail.querySelectorAll('.deal-table tr') : [];
  results.push(dealRows.length === expectedDeals.length + 1);

  resetUiWiringState();

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testApartmentDetailWiring: 단지 선택 시 단지정보/거래내역 연결 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

/**
 * testUI
 * 디자인 개선 사항(style.css 로드, 주요 Card 렌더링, Hover/선택 Class 적용)을 검증한다.
 * 모든 항목이 통과하면 'PASS'를 출력한다.
 */
async function testUI() {
  const results = [];
  resetUiWiringState();

  const styleLink = document.querySelector('link[href="css/style.css"]');
  results.push(!!styleLink);

  const apartments = await mockProvider.searchApartment('');
  const [firstApt, secondApt] = apartments;

  const container = document.createElement('div');
  initSearchApp(container);
  const input = container.querySelector('.search-input');
  const button = container.querySelector('.search-button');

  await performSearch(input, button, firstApt.aptName);
  const firstCard = container.querySelector('.apartment-card');
  results.push(!!firstCard && firstCard.classList.contains('clickable'));

  firstCard.click();
  await wait(50);
  results.push(firstCard.classList.contains('selected'));
  results.push(!!container.querySelector('.favorite-button'));

  await performSearch(input, button, secondApt.aptName);
  const secondCard = container.querySelector('.apartment-card');
  secondCard.click();
  await wait(50);
  results.push(secondCard.classList.contains('selected'));

  resetUiWiringState();

  const allPassed = results.every((result) => result === true);
  assert(allPassed, 'testUI: style.css 로드/Card 렌더링/Hover-Selected Class 확인');
  if (allPassed) {
    console.log('PASS');
  }
}

/**
 * runUiWiringHarness
 * testUiServiceWiring/testApartmentDetailWiring/testUI는 RecentSearchService/FavoriteService
 * 상태를 공유하므로, 동시 실행으로 인한 경쟁 상태를 막기 위해 순차적으로 실행한다.
 */
async function runUiWiringHarness() {
  await testUiServiceWiring();
  await testApartmentDetailWiring();
  await testUI();
}

window.addEventListener('DOMContentLoaded', runUiWiringHarness);
