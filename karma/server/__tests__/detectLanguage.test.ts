import { serialize } from 'cookie';

import { i18nCookieName } from '../../../karma/client/i18n';
import { FALLBACK_LANGUAGE } from '../../../src/constants';
import { createIncomingRequestMock } from '../../../testUtils/api';
import {
  detectLanguage,
  findLanguageByAcceptLanguageHeader,
} from '../i18n/detectLanguage';

jest.mock('../../../src/constants', () => {
  const actual = jest.requireActual('../../../src/constants');

  return {
    ...actual,
    ENABLED_LANGUAGES: [actual.FALLBACK_LANGUAGE, 'de', 'zh'],
  };
});

describe('detectLanguage', () => {
  test('given relevant cookies, uses i18nCookieName to extract', () => {
    const expectedLanguage = 'de';

    const mockContext = createIncomingRequestMock({
      headers: {
        cookie: serialize(i18nCookieName, expectedLanguage),
      },
    });

    expect(detectLanguage(mockContext)).toBe(expectedLanguage);
  });

  test('given relevant cookies with unsupported language, uses fallback', () => {
    const expectedLanguage = 'fr';

    const mockContext = createIncomingRequestMock({
      headers: {
        cookie: serialize(i18nCookieName, expectedLanguage),
      },
    });

    expect(detectLanguage(mockContext)).toBe(FALLBACK_LANGUAGE);
  });

  test('given irrelevant cookies, uses accept-language header', () => {
    const expectedLanguage = 'de';

    const mockContext = createIncomingRequestMock({
      headers: {
        'accept-language': expectedLanguage,
      },
    });

    expect(detectLanguage(mockContext)).toBe(expectedLanguage);
  });

  test('given irrelevant cookies and accept-language header, uses fallback', () => {
    const expectedLanguage = 'fr';

    const mockContext = createIncomingRequestMock({
      headers: {
        'accept-language': expectedLanguage,
      },
    });

    expect(detectLanguage(mockContext)).toBe(FALLBACK_LANGUAGE);
  });

  test('given irreelvant cookies and no header, uses fallback', () => {
    const mockContext = createIncomingRequestMock();

    expect(detectLanguage(mockContext)).toBe(FALLBACK_LANGUAGE);
  });
});

describe('findLanguageByAcceptLanguageHeader', () => {
  test.each([
    ['en-GB;q=0.8', 'en'],
    ['en-GB', 'en'],
    ['en;q=0.8', 'en'],
    ['az-AZ', null],
    ['fr-CA,fr;q=0.8', null],
    ['fr-CA,*;q=0.8', null],
    ['fr-150', null],
    ['en-GB,en-US;q=0.9,fr-CA;q=0.7,en;q=0.83;', 'en'],
    ['fr-CA,fr;q=0.8,en-US;q=0.6,en;q=0.4,*;q=0.1', 'en'],
    ['fr-CA, fr;q=0.8,  en-US;q=0.6,en;q=0.4,    *;q=0.1', 'en'],
    ['fr-CA,fr;q=0.2,en-US;q=0.6,en;q=0.4,*;q=0.5', 'en'],
    ['zh-Hant-cn', 'zh'],
    ['zh-Hant-cn;q=1, zh-cn;q=0.6, zh;q=0.4', 'zh'],
    ['foo', null],
  ])('findLanguageByAcceptLanguageHeader("%s")', (header, expected) => {
    expect(findLanguageByAcceptLanguageHeader(header)).toBe(expected);
  });
});
