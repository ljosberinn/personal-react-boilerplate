/* eslint-disable jest/require-top-level-describe */
import * as Sentry from '@sentry/minimal';
import { waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import 'whatwg-fetch';
import { ENABLED_LANGUAGES, FALLBACK_LANGUAGE } from '../../../src/constants';
import { createIncomingRequestMock } from '../../../testUtils/api';
import { mockConsoleMethods } from '../../../testUtils/console';
import { i18nCache } from '../../server/i18n/cache';
import {
  getI18N,
  createLanguageChangeHandler,
  i18nEndpoint,
  initI18Next,
  RTL_LANGUAGES,
  i18nCookieName,
} from '../i18n';

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
      i18nBundle: i18nCache[FALLBACK_LANGUAGE],
      language: FALLBACK_LANGUAGE,
    });
  });

  test('creates an i18nInstance without crashing given test arguments', () => {
    initI18Next({
      i18nCache,
      language: FALLBACK_LANGUAGE,
    });
  });

  test('initially sets html.lang attribute', () => {
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const language = FALLBACK_LANGUAGE;

    initI18Next({
      i18nBundle: i18nCache[FALLBACK_LANGUAGE],
      language,
    });

    expect(setAttributeSpy).toHaveBeenCalledWith('lang', language);
  });

  test('always changes the html.lang attribute onLanguageChanged', async () => {
    const qsSpy = jest.spyOn(document, 'querySelector');
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const i18n = initI18Next({
      i18nBundle: i18nCache[FALLBACK_LANGUAGE],
      language: FALLBACK_LANGUAGE,
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
    test(`loads a bundle given server-side arguments (language: ${language})`, async () => {
      mockRoute({
        language,
        response: i18nCache[language],
      });

      const fetchSpy = jest.spyOn(window, 'fetch');

      await getI18N(
        language,
        createIncomingRequestMock({
          headers: {
            host: mswEndpoint.replace('http://', ''),
          },
        })
      );

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
      language: FALLBACK_LANGUAGE,
      response: i18nCache[FALLBACK_LANGUAGE],
    });

    const fetchSpy = jest.spyOn(window, 'fetch');

    await getI18N(unknownLanguage);

    expect(fetchSpy).toHaveBeenCalledWith(
      mswEndpoint + i18nEndpoint + FALLBACK_LANGUAGE
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

describe('createLanguageChangeHandler', () => {
  ENABLED_LANGUAGES.forEach((language) => {
    test(`always returns a function (language: ${language})`, () => {
      expect(createLanguageChangeHandler(language)).toBeInstanceOf(Function);
    });

    test('verifies bundle existence on i18n on language change', async () => {
      const i18n = initI18Next({
        i18nBundle: i18nCache[language],
        language,
      });

      const getDataByLanguageSpy = jest.spyOn(i18n, 'getDataByLanguage');

      const otherLanguage = ENABLED_LANGUAGES.find((lng) => lng !== language)!;

      mockRoute({
        language: otherLanguage,
        response: i18nCache[otherLanguage],
      });

      await createLanguageChangeHandler(otherLanguage)();

      await waitFor(() =>
        expect(getDataByLanguageSpy).toHaveBeenLastCalledWith(otherLanguage)
      );
    });

    test('adds the resource bundle when loaded', async () => {
      const i18n = initI18Next({
        i18nBundle: i18nCache[language],
        language,
      });

      const mockAddResourceBundle = jest.spyOn(i18n, 'addResourceBundle');

      const otherLanguage = ENABLED_LANGUAGES.find((lng) => lng !== language)!;

      const response = i18nCache[otherLanguage];

      mockRoute({
        language: otherLanguage,
        response,
      });

      await createLanguageChangeHandler(otherLanguage)();

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

        await createLanguageChangeHandler(otherLanguage)();

        expect(getDataByLanguageSpy).toHaveBeenCalledWith(otherLanguage);
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(addResourceBundleSpy).not.toHaveBeenCalled();
        expect(changeLanguageSpy).toHaveBeenCalledWith(otherLanguage);
      });

      test(`always attempts to store language preference in cookie (bundle already present: ${bool})`, async () => {
        const otherLanguage = ENABLED_LANGUAGES.find(
          (lng) => lng !== language
        )!;

        expect(
          document.cookie.includes(`${i18nCookieName}=${otherLanguage}`)
        ).toBeFalsy();

        await createLanguageChangeHandler(otherLanguage)();

        await waitFor(() =>
          expect(
            document.cookie.includes(`${i18nCookieName}=${otherLanguage}`)
          ).toBeTruthy()
        );
      });
    });
  });
});
