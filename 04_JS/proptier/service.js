/**
 * service.js
 *
 * 비즈니스 로직 레이어. 현재 활성화된 Provider(mockProvider.js 또는
 * apiProvider.js)를 통해 데이터를 처리하고, ui.js에 결과를 전달한다.
 * UI는 이 파일을 통해서만 데이터에 접근한다.
 */

/**
 * activeProvider
 * 현재 활성화된 Provider. Mock Provider만 사용하며,
 * 추후 apiProvider로 교체할 때 이 한 줄만 변경하면 된다.
 * @type {Object}
 */
const activeProvider = mockProvider;

/**
 * SearchService
 * 검색 관련 비즈니스 로직을 담당하는 서비스 객체.
 * UI는 이 객체를 통해서만 검색 데이터를 조회하며, Provider를 직접 호출하지 않는다.
 */
const SearchService = {
  /**
   * search
   * 검색어를 받아 현재 활성화된 Provider를 통해 단지 목록을 조회한다.
   * @param {string} query - 검색어
   * @returns {Promise<Array<Object>>} 검색된 단지 목록
   */
  async search(query) {
    return activeProvider.searchApartment(query);
  },
};

/**
 * ApartmentDetailService
 * 단지 선택 시 단지 정보와 거래내역을 함께 조회하는 서비스 객체.
 * UI는 이 객체를 통해서만 상세 데이터를 조회하며, Provider를 직접 호출하지 않는다.
 */
const ApartmentDetailService = {
  /**
   * getDetail
   * id로 단지 정보(getApartment)와 apartmentId로 연결된 거래내역(getDeals)을 함께 조회한다.
   * @param {number} id - 조회할 단지 id
   * @returns {Promise<{apartment: Object|null, deals: Array<Object>}>} 단지 상세 정보
   */
  async getDetail(id) {
    const apartment = await activeProvider.getApartment(id);
    const deals = await activeProvider.getDeals(id);
    return { apartment, deals };
  },
};

/**
 * RECENT_SEARCH_KEY
 * 최근 검색어 목록을 저장할 storage.js 키.
 */
const RECENT_SEARCH_KEY = 'recentSearches';

/**
 * MAX_RECENT_SEARCHES
 * 최근 검색어 최대 저장 개수.
 */
const MAX_RECENT_SEARCHES = 10;

/**
 * RecentSearchService
 * 최근 검색어를 storage.js를 통해 관리하는 서비스 객체.
 * UI는 이 객체를 통해서만 최근 검색어에 접근하며, storage를 직접 호출하지 않는다.
 */
const RecentSearchService = {
  /**
   * getAll
   * 저장된 최근 검색어 목록을 최신순으로 반환한다.
   * @returns {Array<string>} 최근 검색어 목록
   */
  getAll() {
    const list = load(RECENT_SEARCH_KEY);
    return Array.isArray(list) ? list : [];
  },

  /**
   * add
   * 검색어를 최근 검색어 목록 맨 앞에 추가한다.
   * 공백/빈 문자열은 저장하지 않고, 중복은 제거하며, 최대 개수를 초과하지 않는다.
   * @param {string} keyword - 추가할 검색어
   * @returns {Array<string>} 갱신된 최근 검색어 목록
   */
  add(keyword) {
    const trimmed = (keyword || '').trim();
    if (!trimmed) return this.getAll();

    const withoutDuplicate = this.getAll().filter((item) => item !== trimmed);
    const updated = [trimmed, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES);

    save(RECENT_SEARCH_KEY, updated);
    return updated;
  },

  /**
   * remove
   * 특정 검색어를 최근 검색어 목록에서 삭제한다.
   * @param {string} keyword - 삭제할 검색어
   * @returns {Array<string>} 갱신된 최근 검색어 목록
   */
  remove(keyword) {
    const updated = this.getAll().filter((item) => item !== keyword);
    save(RECENT_SEARCH_KEY, updated);
    return updated;
  },

  /**
   * clear
   * 최근 검색어 목록을 모두 초기화한다.
   * @returns {Array<string>} 빈 배열
   */
  clear() {
    remove(RECENT_SEARCH_KEY);
    return [];
  },
};

/**
 * FAVORITE_KEY
 * 즐겨찾기 목록을 저장할 storage.js 키.
 */
const FAVORITE_KEY = 'favorites';

/**
 * FavoriteService
 * 즐겨찾기한 아파트를 storage.js를 통해 관리하는 서비스 객체.
 * UI는 이 객체를 통해서만 즐겨찾기에 접근하며, storage를 직접 호출하지 않는다.
 * id를 기준으로 중복 저장을 막고, Apartment 객체 전체를 저장한다.
 */
const FavoriteService = {
  /**
   * getAll
   * 저장된 즐겨찾기 아파트 목록 전체를 반환한다.
   * @returns {Array<Object>} 즐겨찾기 아파트 목록
   */
  getAll() {
    const list = load(FAVORITE_KEY);
    return Array.isArray(list) ? list : [];
  },

  /**
   * isFavorite
   * 특정 id의 아파트가 즐겨찾기에 등록되어 있는지 확인한다.
   * @param {number|string} id - 확인할 아파트 id
   * @returns {boolean} 즐겨찾기 여부
   */
  isFavorite(id) {
    return this.getAll().some((apartment) => apartment.id === id);
  },

  /**
   * add
   * 아파트 객체를 즐겨찾기 목록에 추가한다. 이미 존재하는 id면 중복 저장하지 않는다.
   * @param {Object} apartment - id를 포함한 아파트 객체
   * @returns {Array<Object>} 갱신된 즐겨찾기 목록
   */
  add(apartment) {
    if (this.isFavorite(apartment.id)) return this.getAll();

    const updated = [...this.getAll(), apartment];
    save(FAVORITE_KEY, updated);
    return updated;
  },

  /**
   * remove
   * 특정 id의 아파트를 즐겨찾기 목록에서 삭제한다.
   * @param {number|string} id - 삭제할 아파트 id
   * @returns {Array<Object>} 갱신된 즐겨찾기 목록
   */
  remove(id) {
    const updated = this.getAll().filter((apartment) => apartment.id !== id);
    save(FAVORITE_KEY, updated);
    return updated;
  },

  /**
   * toggle
   * 아파트가 즐겨찾기에 있으면 삭제하고, 없으면 추가한다.
   * @param {Object} apartment - id를 포함한 아파트 객체
   * @returns {Array<Object>} 갱신된 즐겨찾기 목록
   */
  toggle(apartment) {
    if (this.isFavorite(apartment.id)) {
      return this.remove(apartment.id);
    }
    return this.add(apartment);
  },
};
