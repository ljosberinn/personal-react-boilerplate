import 'whatwg-fetch';
import { FALLBACK_LANGUAGE, namespaces } from '../../../src/constants';
import { i18nCache } from '../../../testUtils/i18n';
import { getI18n } from '../karma/i18n';

describe('getI18n', () => {
  test(`loads all namespaces given no specific namespace`, async () => {
    const language = FALLBACK_LANGUAGE;

    const resources = await getI18n(language, { namespaces: [...namespaces] });

    namespaces.forEach((namespace) => {
      expect(resources[FALLBACK_LANGUAGE][namespace]).toBeDefined();
    });
  });

  test(`loads only given namespaces if present`, async () => {
    const [firstNamespace, secondNamespace] = namespaces;
    const language = 'en';

    const resources = await getI18n(language, { namespaces: [firstNamespace] });

    expect(resources[language][firstNamespace]).toBeDefined();
    expect(resources[language][secondNamespace]).toBeUndefined();
  });

  test('given an unknown language, uses FALLBACK_LANGUAGE', async () => {
    const unknownLanguage = 'fr';

    const [namespace] = namespaces;

    const resources = await getI18n(unknownLanguage, {
      namespaces: [namespace],
    });

    expect(resources[FALLBACK_LANGUAGE][namespace]).toStrictEqual(
      i18nCache[FALLBACK_LANGUAGE][namespace]
    );

    expect(resources[unknownLanguage]).toBeUndefined();
  });
});
