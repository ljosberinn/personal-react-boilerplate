/* eslint-disable jest/require-top-level-describe */
import { waitFor } from '@testing-library/react';

import 'whatwg-fetch';
import { FALLBACK_LANGUAGE, namespaces } from '../../../src/constants';
import { i18nCache } from '../../../testUtils/i18n';
import { getI18n, initI18Next } from '../i18n';

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
    const language = FALLBACK_LANGUAGE;

    const bundle = await getI18n(language, { namespaces: [...namespaces] });

    namespaces.forEach((namespace) => {
      expect(bundle[namespace]).not.toBeUndefined();
    });
  });

  test(`loads only given namespaces if present`, async () => {
    const [firstNamespace, secondNamespace] = namespaces;
    const language = 'en';

    const bundle = await getI18n(language, { namespaces: [firstNamespace] });

    expect(bundle[firstNamespace]).not.toBeUndefined();
    expect(bundle[secondNamespace]).toBeUndefined();
  });

  test('given an unknown language, uses FALLBACK_LANGUAGE', async () => {
    const unknownLanguage = 'fr';

    const [namespace] = namespaces;

    const bundle = await getI18n(unknownLanguage, {
      namespaces: [namespace],
    });

    expect(bundle[namespace]).toStrictEqual(
      i18nCache[FALLBACK_LANGUAGE][namespace]
    );
  });
});
