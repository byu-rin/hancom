/**
 * app.js
 *
 * SPA 진입점(Entry Point). 애플리케이션 초기화 및
 * 사용할 Provider(mockProvider.js / apiProvider.js) 선택,
 * ui.js 초기 렌더링을 담당한다.
 */

/**
 * initApp
 * SPA 진입점. #search-app 컨테이너에 검색 UI를 초기화하고
 * Service 레이어(SearchService, RecentSearchService, FavoriteService)와 연결한다.
 */
function initApp() {
  const root = document.getElementById('search-app');
  if (!root) return;
  initSearchApp(root);
}

window.addEventListener('DOMContentLoaded', initApp);
