/* eslint-disable jest/require-top-level-describe */
import * as Sentry from '@sentry/node';
import { waitFor } from '@testing-library/react';
import { COOKIE_LOOKUP_KEY_LANG } from '@unly/universal-language-detector';
import i18next from 'i18next';
import cookies from 'js-cookie';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import 'whatwg-fetch';
import {
  makeMockIncomingRequest,
  makeMockServerResponse,
} from '../../testUtils/api';
import { mockConsoleMethods } from '../../testUtils/console';
import { ENABLED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from '../constants';
import { i18nCache } from '../server/i18n/cache';
import {
  getI18N,
  makeChangeLanguageHandler,
  i18nEndpoint,
  initI18Next,
  RTL_LANGUAGES,
} from './i18n';

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const mswEndpoint = 'http://localhost';

interface MockRouteParams {
  language: string;
  response?: Record<string, unknown> | string;
}

const mockRoute = ({ language, response }: MockRouteParams) => {
  server.use(
    rest.get(i18nEndpoint + language, (_req, res, ctx) => {
      if (!response) {
        return res();
      }

      if (typeof response === 'string') {
        return res(ctx.body(response));
      }

      return res(ctx.json(response));
    })
  );
};

describe('initI18Next', () => {
  test('creates an i18nInstance without crashing given prod arguments', () => {
    initI18Next({
      i18nBundle: i18nCache.en,
      language: SUPPORTED_LANGUAGES_MAP.en,
    });
  });

  test('creates an i18nInstance without crashing given test arguments', () => {
    initI18Next({
      i18nCache,
      language: SUPPORTED_LANGUAGES_MAP.en,
    });
  });

  test('always changes the html.lang attribute onLanguageChanged', async () => {
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

  ['en', [...RTL_LANGUAGES][0]].forEach((language) => {
    const dir = language === 'en' ? 'ltr' : 'rtl';

    test(`always changes the html.dir attribute onLanguageChanged (language: ${language})`, async () => {
      const qsSpy = jest.spyOn(document, 'querySelector');
      const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

      const i18n = initI18Next({
        i18nBundle: i18nCache[language],
        language,
      });

      await i18n.changeLanguage(language);
      await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));

      expect(setAttributeSpy).toHaveBeenCalledWith('dir', dir);
    });
  });
});

describe('getI18N', () => {
  ENABLED_LANGUAGES.forEach((language) => {
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip(`loads a bundle given server-side arguments (language: ${language})`, async () => {
      mockRoute({
        language,
        response: i18nCache[language],
      });

      const fetchSpy = jest.spyOn(window, 'fetch');

      await getI18N(language, {
        query: {},
        req: makeMockIncomingRequest({
          headers: {
            host: mswEndpoint,
          },
        }),
        res: makeMockServerResponse(),
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        mswEndpoint + i18nEndpoint + language
      );
    });

    test(`loads a bundle given client-side arguments (language: ${language})`, async () => {
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

  test('responds with fallback language data given an unknown language', async () => {
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

  test('fails gracefully given no response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
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

  test('notifies sentry given no response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
    });

    const sentrySpy = jest.spyOn(Sentry, 'captureException');

    await getI18N(language);

    expect(sentrySpy).toHaveBeenCalledWith(expect.any(Error));

    restoreConsole();
  });

  test('fails gracefully given an invalid response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
      response: 'invalid json',
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

  test('notifies sentry given an invalid response', async () => {
    const restoreConsole = mockConsoleMethods('error');

    const [language] = ENABLED_LANGUAGES;

    mockRoute({
      language,
      response: 'invalid json',
    });

    const sentrySpy = jest.spyOn(Sentry, 'captureException');

    await getI18N(language);

    expect(sentrySpy).toHaveBeenCalledWith(expect.any(Error));

    restoreConsole();
  });
});

describe('makeChangeLanguageHandler', () => {
  ENABLED_LANGUAGES.forEach((language) => {
    test(`always returns a function (language: ${language})`, () => {
      expect(makeChangeLanguageHandler(language)).toBeInstanceOf(Function);
    });

    test('verifies bundle existence on i18n on language change', async () => {
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

    test('adds the resource bundle when loaded', async () => {
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
      test(`always changes the language (bundle already present: ${bool}, language: ${language})`, async () => {
        const getDataByLanguageSpy = jest.spyOn(i18next, 'getDataByLanguage');
        const addResourceBundleSpy = jest.spyOn(i18next, 'addResourceBundle');
        const changeLanguageSpy = jest.spyOn(i18next, 'changeLanguage');

        const fetchSpy = jest.spyOn(window, 'fetch');

        const otherLanguage = ENABLED_LANGUAGES.find(
          (lng) => lng !== language
        )!;

        await makeChangeLanguageHandler(otherLanguage)();

        expect(getDataByLanguageSpy).toHaveBeenCalledWith(otherLanguage);
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(addResourceBundleSpy).not.toHaveBeenCalled();
        expect(changeLanguageSpy).toHaveBeenCalledWith(otherLanguage);
      });

      test(`always attempts to store language preference in cookie (bundle already present: ${bool})`, async () => {
        const setCookieSpy = jest.spyOn(cookies, 'set');

        const otherLanguage = ENABLED_LANGUAGES.find(
          (lng) => lng !== language
        )!;

        await makeChangeLanguageHandler(otherLanguage)();

        await waitFor(() =>
          expect(setCookieSpy).toHaveBeenCalledWith(
            COOKIE_LOOKUP_KEY_LANG,
            otherLanguage
          )
        );
      });
    });
  });
});
