// via https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
export const hasLocalStorage = (() => {
  try {
    const x = '__storage_test__';

    localStorage.setItem(x, x);
    localStorage.removeItem(x);

    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      localStorage &&
      localStorage.length !== 0
    );
  }
})();

export const supportsServiceWorker = (() => {
  const { navigator, location } = window;
  const isApiAvailable = navigator && 'serviceWorker' in navigator;
  const isHttps = location.protocol === 'https:';
  const isLocalHost = location.host.match(/(localhost|127.0.0.1)/);

  return !!(isApiAvailable && (isHttps || isLocalHost));
})();
