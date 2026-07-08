/**
 * storage.js
 *
 * 브라우저 저장소(LocalStorage 등)에 대한 직접 접근을 담당하는 레이어.
 * UI에서는 이 파일을 직접 호출하지 않으며, Provider(mockProvider.js / apiProvider.js)를
 * 통해서만 간접적으로 사용된다.
 */

/**
 * save
 * 값을 JSON으로 직렬화하여 LocalStorage에 저장한다.
 * 예외가 발생해도 앱이 종료되지 않도록 내부에서 처리한다.
 * @param {string} key - 저장할 키
 * @param {*} value - 저장할 값 (JSON 직렬화 가능한 값)
 * @returns {boolean} 저장 성공 여부
 */
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * load
 * LocalStorage에서 값을 조회하여 JSON으로 역직렬화한다.
 * @param {string} key - 조회할 키
 * @returns {*} 역직렬화된 값. 값이 없거나 실패 시 null
 */
function load(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

/**
 * remove
 * LocalStorage에서 특정 키를 삭제한다.
 * @param {string} key - 삭제할 키
 * @returns {boolean} 삭제 성공 여부
 */
function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * clear
 * 특정 키의 값을 초기화한다.
 * @param {string} key - 초기화할 키
 * @returns {boolean} 초기화 성공 여부
 */
function clear(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * exists
 * LocalStorage에 특정 키가 존재하는지 확인한다.
 * @param {string} key - 확인할 키
 * @returns {boolean} 존재 여부
 */
function exists(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    return false;
  }
}
