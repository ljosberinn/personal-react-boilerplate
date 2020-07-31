import * as Sentry from '@sentry/node';
import { waitFor } from '@testing-library/react';
import { COOKIE_LOOKUP_KEY_LANG } from '@unly/universal-language-detector';
import cookies from 'js-cookie';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import 'whatwg-fetch';
import { mockConsoleMethods } from '../../testUtils/console';
import { ENABLED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from '../constants';
import { i18nCache } from '../server/i18n';
import {
  getI18N,
  makeChangeLanguageHandler,
  i18nEndpoint,
  initI18Next,
} from './i18n';

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(server.close);

const mswEndpoint = 'http://localhost';

interface MockRouteArgs {
  language: string;
  response: any;
  stringify?: boolean;
}

const mockRoute = ({ language, response, stringify = true }: MockRouteArgs) => {
  server.use(
    rest.get(i18nEndpoint + language, (_req, res, ctx) =>
      res(stringify ? ctx.json(response) : ctx.body(response))
    )
  );
};

describe('initI18Next', () => {
  it('creates an i18nInstance without crashing given prod arguments', () => {
    initI18Next({
      i18nBundle: i18nCache.en,
      language: SUPPORTED_LANGUAGES_MAP.en,
    });
  });

  it('creates an i18nInstance without crashing given test arguments', () => {
    initI18Next({
      i18nCache,
      language: SUPPORTED_LANGUAGES_MAP.en,
    });
  });

  it('always changes the html.lang attribute onLanguageChanged', async () => {
    const qsSpy = jest.spyOn(document, 'querySelector');
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const i18n = initI18Next({
      i18nBundle: i18nCache.en,
      language: SUPPORTED_LANGUAGES_MAP.en,
    });

    const otherLanguage = 'de';

    await i18n.changeLanguage(otherLanguage);
    await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));

    expect(setAttributeSpy).toHaveBeenCalledWith('lang', otherLanguage);
  });

  it('always changes the html.dir attribute onLanguageChanged', async () => {
    const qsSpy = jest.spyOn(document, 'querySelector');
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const i18n = initI18Next({
      i18nBundle: i18nCache.en,
      language: SUPPORTED_LANGUAGES_MAP.en,
    });

    const otherLanguage = 'de';

    await i18n.changeLanguage(otherLanguage);
    await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));

    expect(setAttributeSpy).toHaveBeenCalledWith('dir', expect.any(String));
  });
});

describe('getI18N', () => {
  ENABLED_LANGUAGES.forEach((language) => {
    it('loads a bundle given server-side arguments', async () => {
      mockRoute({
        language,
        response: i18nCache[language],
      });

      const fetchSpy = jest.spyOn(window, 'fetch');

      await getI18N(language, {
        AppTree: (_) => null,
        pathname: '',
        query: {},
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        mswEndpoint + i18nEndpoint + language
      );
    });

    it('loads a bundle given client-side arguments', async () => {
      mockRoute({
        language,
        response: i18nCache[language],
      });

      const fetchSpy = jest.spyOn(window, 'fetch');

      await getI18N(language);

      expect(fetchSpy).toHaveBeenCalledWith(
        mswEndpoint + i18nEndpoint + language
      );
    });
  });

  it('responds with fallback language data given an unknown language', async () => {
    const unknownLanguage = 'foo';

    mockRoute({
      language: SUPPORTED_LANGUAGES_MAP.en,
      response: i18nCache[SUPPORTED_LANGUAGES_MAP.en],
    });

    const fetchSpy = jest.spyOn(window, 'fetch');

    await getI18N(unknownLanguage);

    expect(fetchSpy).toHaveBeenCalledWith(
      mswEndpoint + i18nEndpoint + SUPPORTED_LANGUAGES_MAP.en
    );
  });

  it('fails gracefully given no response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
      response: undefined,
    });

    const fetchSpy = jest.spyOn(window, 'fetch');

    const response = await getI18N(language);

    expect(fetchSpy).toHaveBeenCalledWith(
      mswEndpoint + i18nEndpoint + language
    );

    expect(response).toMatchObject({});
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  it('notifies sentry given no response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
      response: undefined,
    });

    const sentrySpy = jest.spyOn(Sentry, 'captureException');

    await getI18N(language);

    expect(sentrySpy).toHaveBeenCalledWith(expect.any(Error));

    restoreConsole();
  });

  it('fails gracefully given an invalid response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
      response: 'invalid json',
      stringify: false,
    });

    const fetchSpy = jest.spyOn(window, 'fetch');

    const response = await getI18N(language);

    expect(fetchSpy).toHaveBeenCalledWith(
      mswEndpoint + i18nEndpoint + language
    );

    expect(response).toMatchObject({});
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  it('notifies sentry given an invalid response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
      response: 'invalid json',
      stringify: false,
    });

    const sentrySpy = jest.spyOn(Sentry, 'captureException');

    await getI18N(language);

    expect(sentrySpy).toHaveBeenCalledWith(expect.any(Error));

    restoreConsole();
  });
});

describe('makeChangeLanguageHandler', () => {
  ENABLED_LANGUAGES.forEach((language) => {
    it(`always returns a function (language: ${language})`, () => {
      expect(makeChangeLanguageHandler(language)).toBeInstanceOf(Function);
    });

    it('verifies bundle existence on i18n on language change', async () => {
      const i18n = initI18Next({
        i18nBundle: i18nCache[language],
        language: SUPPORTED_LANGUAGES_MAP[language],
      });

      const getDataByLanguageSpy = jest.spyOn(i18n, 'getDataByLanguage');

      const otherLanguage = ENABLED_LANGUAGES.find((lng) => lng !== language)!;

      mockRoute({
        language: otherLanguage,
        response: i18nCache[otherLanguage],
      });

      await makeChangeLanguageHandler(otherLanguage)();

      await waitFor(() =>
        expect(getDataByLanguageSpy).toHaveBeenLastCalledWith(otherLanguage)
      );
    });

    it('adds the resource bundle when loaded', async () => {
      const i18n = initI18Next({
        i18nBundle: i18nCache[language],
        language: SUPPORTED_LANGUAGES_MAP[language],
      });

      const mockAddResourceBundle = jest.spyOn(i18n, 'addResourceBundle');

      const otherLanguage = ENABLED_LANGUAGES.find((lng) => lng !== language)!;

      const response = i18nCache[otherLanguage];

      mockRoute({
        language: otherLanguage,
        response,
      });

      await makeChangeLanguageHandler(otherLanguage)();

      await waitFor(() =>
        expect(mockAddResourceBundle).toHaveBeenCalledTimes(
          Object.entries(response).length
        )
      );
    });

    [true, false].forEach((bool) => {
      it(`always changes the language (bundle already present: ${bool})`, async () => {});

      it(`always attempts to store language preference in cookie (bundle already present: ${bool})`, async () => {
        const mockSet = jest.spyOn(cookies, 'set');

        const otherLanguage = ENABLED_LANGUAGES.find(
          (lng) => lng !== language
        )!;
        await makeChangeLanguageHandler(otherLanguage)();

        await waitFor(() =>
          expect(mockSet).toHaveBeenCalledWith(
            COOKIE_LOOKUP_KEY_LANG,
            otherLanguage
          )
        );
      });
    });
  });
});
