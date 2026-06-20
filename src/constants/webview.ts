import { buildAppChromeScript } from './appChrome';

export const WEBVIEW_BRIDGE_SCRIPT = `
${buildAppChromeScript()}
(function () {
  if (window.__memoryUpgradesBridgeInstalled) {
    return true;
  }
  window.__memoryUpgradesBridgeInstalled = true;

  function post(type, payload) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload || {} }));
    } catch (e) {}
  }

  document.addEventListener('click', function (event) {
    var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) {
      return;
    }

    var href = anchor.getAttribute('href') || '';
    if (!href || href === '#' || href === '#0' || href.indexOf('javascript:') === 0) {
      event.preventDefault();
      return;
    }

    if (anchor.target === '_blank' || anchor.target === '_new') {
      event.preventDefault();
      post('open-external', { url: anchor.href });
    }
  }, true);

  window.open = function (url) {
    if (url) {
      post('open-external', { url: String(url) });
    }
    return null;
  };

  post('page-html', {
    url: window.location.href,
    html: document.documentElement.outerHTML
  });

  true;
})();
true;
`;