/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable jest/require-top-level-describe */
// import * as Sentry from '@sentry/node';
import { waitFor } from '@testing-library/react';
import i18next from 'i18next';
// import { rest } from 'msw';
import { setupServer } from 'msw/node';

import 'whatwg-fetch';
import { ENABLED_LANGUAGES, FALLBACK_LANGUAGE } from '../../../src/constants';
// import { createIncomingRequestMock } from '../../../testUtils/api';
// import { mockConsoleMethods } from '../../../testUtils/console';
import { i18nCache, namespaces } from '../../server/i18n/cache';
import {
  // getI18n,
  createLanguageChangeHandler,
  // i18nEndpoint,
  initI18Next,
  // i18nCookieName,
} from '../i18n';

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// const mswEndpoint = 'http://localhost';

// interface MockRouteParams {
//   language: string;
//   response?: Record<string, unknown> | string;
// }

// const mockRoute = ({ language, response }: MockRouteParams) => {
//   server.use(
//     rest.get(i18nEndpoint + language, (_req, res, ctx) => {
//       if (!response) {
//         return res();
//       }

//       if (typeof response === 'string') {
//         return res(ctx.body(response));
//       }

//       return res(ctx.json(response));
//     })
//   );
// };

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

    const instance = initI18Next({
      i18nBundle: i18nCache[FALLBACK_LANGUAGE],
      language: FALLBACK_LANGUAGE,
    });

    const otherLanguage = 'de';

    await instance.changeLanguage(otherLanguage);
    await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));

    expect(setAttributeSpy).toHaveBeenCalledWith('lang', otherLanguage);
  });

  ['en', 'ar'].forEach((language) => {
    const dir = language === 'en' ? 'ltr' : 'rtl';

    test(`always changes the html.dir attribute onLanguageChanged (language: ${language})`, async () => {
      const qsSpy = jest.spyOn(document, 'querySelector');
      const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

      const instance = initI18Next({
        i18nBundle: i18nCache[language],
        language,
      });

      await instance.changeLanguage(language);
      await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));

      expect(setAttributeSpy).toHaveBeenCalledWith('dir', dir);
    });
  });
});

// describe('getI18n', () => {
//   ENABLED_LANGUAGES.forEach((language) => {
//     test.skip(`loads a bundle given server-side arguments (language: ${language})`, async () => {
//       mockRoute({
//         language,
//         response: i18nCache[language],
//       });

//       const fetchSpy = jest.spyOn(window, 'fetch');

//       await getI18n(language, {
//         req: createIncomingRequestMock({
//           headers: {
//             host: mswEndpoint.replace('http://', ''),
//           },
//         }),
//       });

//       expect(fetchSpy).toHaveBeenCalledWith(
//         mswEndpoint + i18nEndpoint + language
//       );
//     });

//     test.skip(`loads a bundle given client-side arguments (language: ${language})`, async () => {
//       mockRoute({
//         language,
//         response: i18nCache[language],
//       });

//       const fetchSpy = jest.spyOn(window, 'fetch');

//       await getI18n(language);

//       expect(fetchSpy).toHaveBeenCalledWith(
//         mswEndpoint + i18nEndpoint + language
//       );
//     });
//   });

//   test.skip('responds with fallback language data given an unknown language', async () => {
//     const unknownLanguage = 'foo';

//     mockRoute({
//       language: FALLBACK_LANGUAGE,
//       response: i18nCache[FALLBACK_LANGUAGE],
//     });

//     const fetchSpy = jest.spyOn(window, 'fetch');

//     await getI18n(unknownLanguage);

//     expect(fetchSpy).toHaveBeenCalledWith(
//       mswEndpoint + i18nEndpoint + FALLBACK_LANGUAGE
//     );
//   });

//   test.skip('fails gracefully given no response', async () => {
//     const { restoreConsole } = mockConsoleMethods('error');

//     const [language] = ENABLED_LANGUAGES;

//     mockRoute({
//       language,
//     });

//     const fetchSpy = jest.spyOn(window, 'fetch');

//     const response = await getI18n(language);

//     expect(fetchSpy).toHaveBeenCalledWith(
//       mswEndpoint + i18nEndpoint + language
//     );

//     expect(response).toMatchObject({});
//     // eslint-disable-next-line no-console
//     expect(console.error).toHaveBeenCalledTimes(1);

//     restoreConsole();
//   });

//   test.skip('notifies sentry given no response', async () => {
//     const { restoreConsole } = mockConsoleMethods('error');

//     const [language] = ENABLED_LANGUAGES;

//     mockRoute({
//       language,
//     });

//     const sentrySpy = jest.spyOn(Sentry, 'captureException');

//     await getI18n(language);

//     expect(sentrySpy).toHaveBeenCalledWith(expect.any(Error));

//     restoreConsole();
//   });

//   test.skip('fails gracefully given an invalid response', async () => {
//     const { restoreConsole } = mockConsoleMethods('error');

//     const [language] = ENABLED_LANGUAGES;

//     mockRoute({
//       language,
//       response: 'invalid json',
//     });

//     const fetchSpy = jest.spyOn(window, 'fetch');

//     const response = await getI18n(language);

//     expect(fetchSpy).toHaveBeenCalledWith(
//       mswEndpoint + i18nEndpoint + language
//     );

//     expect(response).toMatchObject({});
//     // eslint-disable-next-line no-console
//     expect(console.error).toHaveBeenCalledTimes(1);

//     restoreConsole();
//   });

//   test.skip('notifies sentry given an invalid response', async () => {
//     const { restoreConsole } = mockConsoleMethods('error');

//     const [language] = ENABLED_LANGUAGES;

//     mockRoute({
//       language,
//       response: 'invalid json',
//     });

//     const sentrySpy = jest.spyOn(Sentry, 'captureException');

//     await getI18n(language);

//     expect(sentrySpy).toHaveBeenCalledWith(expect.any(Error));

//     restoreConsole();
//   });
// });

describe('createLanguageChangeHandler', () => {
  beforeEach(() => {
    /**
     * required as `reportNamespaces` is actually only defined after executing
     * `useTranslation` at least once
     * @see https://github.com/i18next/react-i18next/blob/dbd54d544ccca654f64a49bc8390d3bf87f02d84/src/useTranslation.js#L10
     */
    Object.defineProperty(i18next, 'reportNamespaces', {
      configurable: true,
      value: {
        addUsedNamespaces: jest.fn(),
        getUsedNamespaces: jest.fn().mockReturnValue(namespaces),
      },
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(i18next, 'reportNamespaces', {
      configurable: true,
      value: undefined,
      writable: true,
    });
  });

  ENABLED_LANGUAGES.forEach((language) => {
    test(`always returns a function (language: ${language})`, () => {
      expect(createLanguageChangeHandler(language)).toBeInstanceOf(Function);
    });

    // test.skip('verifies bundle existence on i18n on language change', async () => {
    //   const instance = initI18Next({
    //     i18nBundle: i18nCache[language],
    //     language,
    //   });

    //   const getDataByLanguageSpy = jest.spyOn(instance, 'getDataByLanguage');

    //   const otherLanguage = ENABLED_LANGUAGES.find((lng) => lng !== language)!;

    //   mockRoute({
    //     language: otherLanguage,
    //     response: i18nCache[otherLanguage],
    //   });

    //   await createLanguageChangeHandler(otherLanguage)();

    //   await waitFor(() =>
    //     expect(getDataByLanguageSpy).toHaveBeenLastCalledWith(otherLanguage)
    //   );
    // });

    // test.skip('adds the resource bundle when loaded', async () => {
    //   const instance = initI18Next({
    //     i18nBundle: i18nCache[language],
    //     language,
    //   });

    //   const mockAddResourceBundle = jest.spyOn(instance, 'addResourceBundle');

    //   const otherLanguage = ENABLED_LANGUAGES.find((lng) => lng !== language)!;

    //   const response = i18nCache[otherLanguage];

    //   mockRoute({
    //     language: otherLanguage,
    //     response,
    //   });

    //   await createLanguageChangeHandler(otherLanguage)();

    //   await waitFor(() =>
    //     expect(mockAddResourceBundle).toHaveBeenCalledTimes(
    //       Object.entries(response).length
    //     )
    //   );
    // });

    // [true, false].forEach((bool) => {
    //   test.skip(`always changes the language (bundle already present: ${bool}, language: ${language})`, async () => {
    //     const getDataByLanguageSpy = jest.spyOn(i18next, 'getDataByLanguage');
    //     const addResourceBundleSpy = jest.spyOn(i18next, 'addResourceBundle');
    //     const changeLanguageSpy = jest.spyOn(i18next, 'changeLanguage');

    //     const fetchSpy = jest.spyOn(window, 'fetch');

    //     const otherLanguage = ENABLED_LANGUAGES.find(
    //       (lng) => lng !== language
    //     )!;

    //     await createLanguageChangeHandler(otherLanguage)();

    //     expect(getDataByLanguageSpy).toHaveBeenCalledWith(otherLanguage);
    //     expect(fetchSpy).not.toHaveBeenCalled();
    //     expect(addResourceBundleSpy).not.toHaveBeenCalled();
    //     expect(changeLanguageSpy).toHaveBeenCalledWith(otherLanguage);
    //   });

    //   test.skip(`always attempts to store language preference in cookie (bundle already present: ${bool})`, async () => {
    //     const otherLanguage = ENABLED_LANGUAGES.find(
    //       (lng) => lng !== language
    //     )!;

    //     expect(
    //       document.cookie.includes(`${i18nCookieName}=${otherLanguage}`)
    //     ).toBeFalsy();

    //     await createLanguageChangeHandler(otherLanguage)();

    //     await waitFor(() =>
    //       expect(
    //         document.cookie.includes(`${i18nCookieName}=${otherLanguage}`)
    //       ).toBeTruthy()
    //     );
    //   });
    // });
  });
});
