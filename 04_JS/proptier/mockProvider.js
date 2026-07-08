/**
 * mockProvider.js
 *
 * 실제 서버 없이 JSON Mock 데이터셋(./data/apartments.json, ./data/deals.json)을
 * fetch()로 읽어와 동작하는 Mock Provider. index.html 기준 상대경로를 사용하므로
 * 서버 문서 루트가 proptier 폴더가 아니어도(예: 상위 폴더를 서빙) 정상 동작한다.
 * apiProvider.js와 동일한 인터페이스를 구현하여 service.js에서 교체 가능하도록 한다.
 */

/** @type {string} apartments.json 경로 (index.html 기준 상대경로) */
const APARTMENTS_URL = './data/apartments.json';

/** @type {string} deals.json 경로 (index.html 기준 상대경로) */
const DEALS_URL = './data/deals.json';

/** @type {Array<Object>|null} apartments.json fetch 결과 캐시 */
let apartmentsCache = null;

/** @type {Array<Object>|null} deals.json fetch 결과 캐시 */
let dealsCache = null;

/**
 * fetchJson
 * 지정한 URL을 fetch로 읽어 JSON으로 파싱한다.
 * 예외가 발생해도 앱이 종료되지 않도록 빈 배열을 반환한다.
 * @param {string} url - 조회할 JSON 파일 경로
 * @returns {Promise<Array<Object>>} 파싱된 JSON 배열. 실패 시 빈 배열
 */
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return [];
  }
}

/**
 * fetchApartments
 * apartments.json을 fetch로 읽어온다. 이후 호출은 캐시된 값을 재사용한다.
 * @returns {Promise<Array<Object>>} 단지 목록. 실패 시 빈 배열
 */
async function fetchApartments() {
  if (apartmentsCache) return apartmentsCache;
  apartmentsCache = await fetchJson(APARTMENTS_URL);
  return apartmentsCache;
}

/**
 * fetchDeals
 * deals.json을 fetch로 읽어온다. 이후 호출은 캐시된 값을 재사용한다.
 * @returns {Promise<Array<Object>>} 거래내역 목록. 실패 시 빈 배열
 */
async function fetchDeals() {
  if (dealsCache) return dealsCache;
  dealsCache = await fetchJson(DEALS_URL);
  return dealsCache;
}

/**
 * searchApartment
 * 단지명 또는 주소에 검색어가 포함된 단지를 찾는다.
 * @param {string} keyword - 검색어 (빈 문자열이면 전체 목록 반환)
 * @returns {Promise<Array<Object>>} 검색된 단지 목록
 */
async function searchApartment(keyword) {
  const apartments = await fetchApartments();
  const trimmed = (keyword || '').trim().toLowerCase();
  if (!trimmed) return apartments;
  return apartments.filter(
    (apartment) =>
      apartment.aptName.toLowerCase().includes(trimmed) || apartment.address.toLowerCase().includes(trimmed)
  );
}

/**
 * getApartment
 * id로 단지 정보를 조회한다.
 * @param {number} id - 조회할 단지 id
 * @returns {Promise<Object|null>} 단지 정보. 없으면 null
 */
async function getApartment(id) {
  const apartments = await fetchApartments();
  return apartments.find((apartment) => apartment.id === id) || null;
}

/**
 * getDeals
 * apartmentId로 연결된 거래내역 목록을 조회한다.
 * @param {number} apartmentId - 조회할 단지 id
 * @returns {Promise<Array<Object>>} 거래내역 목록
 */
async function getDeals(apartmentId) {
  const deals = await fetchDeals();
  return deals.filter((deal) => deal.apartmentId === apartmentId);
}

/**
 * mockProvider
 * apiProvider.js와 동일한 인터페이스를 갖는 Mock Provider 객체.
 * service.js는 이 객체를 통해서만 데이터를 조회한다.
 */
const mockProvider = {
  searchApartment,
  getApartment,
  getDeals,
};
