/* eslint-disable jest/require-top-level-describe */
import { waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import 'whatwg-fetch';
import type { Namespace } from '../../../src/constants';
import { FALLBACK_LANGUAGE, namespaces } from '../../../src/constants';
import { i18nCache } from '../../server/i18n/cache';
import {
  getI18n,
  initI18Next,
  getI18nPathByLanguageAndNamespace,
} from '../i18n';

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

type MockRouteParams = {
  language: string;
  response?: Record<string, unknown> | string;
  namespaces?: Namespace[];
};

const mockRoute = ({ language, response }: MockRouteParams) => {
  namespaces.forEach((namespace) => {
    const path = getI18nPathByLanguageAndNamespace({ language, namespace });

    server.use(
      rest.get(`http://localhost${path}`, (_req, res, ctx) => {
        if (!response) {
          return res();
        }

        if (typeof response === 'string') {
          return res(ctx.body(response));
        }

        return res(ctx.json(response));
      })
    );
  });
};

describe('initI18Next', () => {
  test('creates an i18nInstance without crashing given prod arguments', () => {
    initI18Next({
      bundle: i18nCache[FALLBACK_LANGUAGE],
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
      bundle: i18nCache[FALLBACK_LANGUAGE],
      language,
    });

    expect(setAttributeSpy).toHaveBeenCalledWith('lang', language);
  });

  test('always changes the html.lang attribute onLanguageChanged', async () => {
    const qsSpy = jest.spyOn(document, 'querySelector');
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const instance = initI18Next({
      bundle: i18nCache[FALLBACK_LANGUAGE],
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
        bundle: i18nCache[language],
        language,
      });

      await instance.changeLanguage(language);
      await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));

      expect(setAttributeSpy).toHaveBeenCalledWith('dir', dir);
    });
  });
});

describe('getI18n', () => {
  test(`loads all namespaces given no specific namespace`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');
    const language = 'en';

    mockRoute({
      language,
      namespaces: [...namespaces],
      response: {},
    });

    await getI18n(language, { namespaces: [...namespaces] });

    namespaces.forEach((namespace) => {
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining(namespace));
    });
  });

  test(`loads only given namespaces if present`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const [firstNamespace, secondNamespace] = namespaces;
    const language = 'en';

    mockRoute({
      language,
      namespaces: [firstNamespace],
      response: {},
    });

    await getI18n(language, { namespaces: [firstNamespace] });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining(firstNamespace)
    );

    expect(fetchSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(secondNamespace)
    );
  });

  test('given an unknown language, uses FALLBACK_LANGUAGE', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const unknownLanguage = 'fr';

    [FALLBACK_LANGUAGE, unknownLanguage].forEach((language) => {
      mockRoute({
        language,
        namespaces: [namespaces[0]],
        response: {},
      });
    });

    await getI18n(unknownLanguage, { namespaces: [namespaces[0]] });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining(FALLBACK_LANGUAGE)
    );
    expect(fetchSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(unknownLanguage)
    );
  });
});

describe('getI18nPathByLanguageAndNamespace', () => {
  test('matches snapshot', () => {
    expect(
      getI18nPathByLanguageAndNamespace({
        language: FALLBACK_LANGUAGE,
        namespace: 'i18n',
      })
    ).toMatchInlineSnapshot(`"/static/locales/en/i18n.json"`);
  });
});
