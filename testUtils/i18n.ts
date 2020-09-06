import type { ResourceStore, i18n } from 'i18next';

class MockStore implements ResourceStore {
  off = jest.fn();

  on = jest.fn();

  options = {};

  data = {};
}

export class MockI18n implements i18n {
  init = jest.fn();

  loadResources = jest.fn();

  t = jest.fn((key) => key);

  use = jest.fn();

  addResource = jest.fn();

  addResourceBundle = jest.fn();

  addResources = jest.fn();

  changeLanguage = jest.fn();

  cloneInstance = jest.fn();

  createInstance = jest.fn();

  dir = jest.fn();

  emit = jest.fn();

  getDataByLanguage = jest.fn();

  getResource = jest.fn();

  getFixedT = jest.fn();

  getResourceBundle = jest.fn();

  hasResourceBundle = jest.fn();

  isInitialized = true;

  loadLanguages = jest.fn();

  loadNamespaces = jest.fn();

  on = jest.fn();

  reloadResources = jest.fn();

  removeResourceBundle = jest.fn();

  off = jest.fn();

  setDefaultNamespace = jest.fn();

  exists = jest.fn();

  format = jest.fn();

  language = 'en';

  languages = [];

  options = {};

  reportNamespaces = {
    addUsedNamespaces: jest.fn(),
    getUsedNamespaces: jest.fn(),
  };

  modules = {
    external: [],
  };

  services = {
    backendConnector: undefined,
    i18nFormat: undefined,
    interpolator: {
      init: jest.fn(),
      interpolate: jest.fn(),
      nest: jest.fn(),
      reset: jest.fn(),
      resetRegExp: jest.fn(),
    },
    languageDetector: undefined,
    languageUtils: undefined,
    logger: undefined,
    pluralResolver: undefined,
    resourceStore: new MockStore(),
  };

  store = new MockStore();
}
