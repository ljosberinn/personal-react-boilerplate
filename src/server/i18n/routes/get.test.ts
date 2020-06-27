import i18nCache from '../../../../src/server/i18n';
import { testLambda, RequestMethods } from '../../../../testUtils/lambda';
import { ENABLED_LANGUAGES } from '../../../constants';
import { NOT_FOUND, BAD_REQUEST, OK } from '../../../utils/statusCodes';
import i18nGetHandler from './get';

const methods: Set<RequestInit['method']> = new Set(['GET', 'HEAD']);
const url = '/api/v1/i18n';
const catchAllName = 'language';

describe('api/i18n', () => {
  test('should be a function', () => {
    expect(i18nGetHandler).toBeInstanceOf(Function);
  });

  RequestMethods.filter(requestMethod => !methods.has(requestMethod)).forEach(
    method => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(i18nGetHandler, {
          catchAllName,
          method,
          url,
        });

        expect(response.status).toBe(NOT_FOUND);
      });
    }
  );

  test('responds with BAD_REQUEST given no language', async () => {
    const response = await testLambda(i18nGetHandler, {
      catchAllName,
      url,
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test('responds with BAD_REQUEST given no valid language', async () => {
    const response = await testLambda(i18nGetHandler, {
      catchAllName,
      url: url + '/asdf',
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test('responds with BAD_REQUEST given no enabled language', async () => {
    const response = await testLambda(i18nGetHandler, {
      catchAllName,
      url: url + '/fr',
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  ENABLED_LANGUAGES.forEach(language => {
    test(`responds with a JSON given an enabled language (lang: ${language})`, async () => {
      const response = await testLambda(i18nGetHandler, {
        catchAllName,
        url: [url, language].join('/'),
      });

      expect(response.status).toBe(OK);

      const json = await response.json();

      expect(json).toMatchObject(i18nCache[language]);
    });
  });
});
