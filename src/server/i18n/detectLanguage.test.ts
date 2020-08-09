import { serialize } from 'cookie';

import { makeMockIncomingRequest } from '../../../testUtils/api';
import { i18nCookieName } from '../../client/i18n';
import {
  detectLanguage,
  findLanguageByAcceptLanguageHeader,
} from './detectLanguage';

jest.mock('../../constants', () => {
  const actual = jest.requireActual('../../constants');

  return {
    ...actual,
    ENABLED_LANGUAGES: ['en', 'de', 'zh'],
    SUPPORTED_LANGUAGES_MAP: {
      de: 'de',
      en: 'en',
      zh: 'zh',
    },
  };
});

describe('detectLanguage', () => {
  test('given relevant cookies, uses i18nCookieName to extract', () => {
    const expectedLanguage = 'de';

    const mockContext = makeMockIncomingRequest({
      headers: {
        cookie: serialize(i18nCookieName, expectedLanguage),
      },
    });

    expect(detectLanguage(mockContext)).toBe(expectedLanguage);
  });

  test('given relevant cookies with unsupported language, uses fallback', () => {
    const expectedLanguage = 'fr';

    const mockContext = makeMockIncomingRequest({
      headers: {
        cookie: serialize(i18nCookieName, expectedLanguage),
      },
    });

    expect(detectLanguage(mockContext)).toBe('en');
  });

  test('given irrelevant cookies, uses accept-language header', () => {
    const expectedLanguage = 'de';

    const mockContext = makeMockIncomingRequest({
      headers: {
        'accept-language': expectedLanguage,
      },
    });

    expect(detectLanguage(mockContext)).toBe(expectedLanguage);
  });

  test('given irrelevant cookies and accept-language header, uses fallback', () => {
    const expectedLanguage = 'fr';

    const mockContext = makeMockIncomingRequest({
      headers: {
        'accept-language': expectedLanguage,
      },
    });

    expect(detectLanguage(mockContext)).toBe('en');
  });

  test('given irreelvant cookies and no header, uses fallback', () => {
    const mockContext = makeMockIncomingRequest();

    expect(detectLanguage(mockContext)).toBe('en');
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
