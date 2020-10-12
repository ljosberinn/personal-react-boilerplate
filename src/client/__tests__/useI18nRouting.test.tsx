import i18n from 'i18next';

import { hookAct, renderHook } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import {
  DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME,
  ENABLED_LANGUAGES,
  FALLBACK_LANGUAGE,
} from '../../constants';
import { useI18nRouting } from '../hooks/useI18nRouting';

const setup = ({ push = jest.fn(), locale = FALLBACK_LANGUAGE }) => {
  jest.spyOn(window.location, 'assign');

  const changeLocaleSpy = jest.spyOn(i18n, 'changeLanguage');

  const mockRoute = `[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]/foo/bar/baz`;
  const expectedRoute = mockRoute.replace(
    `[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]`,
    locale
  );

  const { result } = renderHook(useI18nRouting, {
    omitKarmaProvider: true,
    router: {
      push,
      route: mockRoute,
    },
  });

  return {
    changeLocaleSpy,
    expectedRoute,
    mockRoute,
    push,
    result,
  };
};

describe('hooks/useI18nRouting', () => {
  const realLocation = window.location;

  beforeEach(() => {
    // @ts-expect-error jest does not support location to be spied on
    delete window.location;
    window.location = { ...realLocation, assign: jest.fn() };
  });

  afterEach(() => {
    window.location = realLocation;
  });

  test('warns when given a language not included in ENABLED_LANGUAGES', async () => {
    const { restoreConsole } = mockConsoleMethods('warn');

    const locale = 'foo';

    const { push, result } = setup({ locale });

    await hookAct(async () => {
      await result.current.changeLocale(locale);
    });

    expect(push).not.toHaveBeenCalled();
    expect(window.location.assign).not.toHaveBeenCalled();

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  ENABLED_LANGUAGES.forEach((locale) => {
    describe('changeLocale', () => {
      test(`replaces the current locale with the new (lang: "${locale}")`, async () => {
        const { expectedRoute, push, result } = setup({ locale });

        await hookAct(async () => {
          await result.current.changeLocale(locale);
        });

        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith(expectedRoute);
      });

      test('uses window.location.assign in case useRouter().push fails', async () => {
        const push = jest.fn().mockImplementationOnce(() => {
          throw new Error('test error');
        });

        const { expectedRoute, result } = setup({ locale, push });

        await hookAct(async () => {
          await result.current.changeLocale(locale);
        });

        expect(push).toHaveBeenCalledTimes(1);

        expect(window.location.assign).toHaveBeenCalledTimes(1);
        expect(window.location.assign).toHaveBeenCalledWith(expectedRoute);
      });

      test('changes i18n instance language on changeLocale execution', async () => {
        const { changeLocaleSpy, result } = setup({ locale });

        await hookAct(async () => {
          await result.current.changeLocale(locale);
        });

        expect(changeLocaleSpy).toHaveBeenCalledTimes(1);
        expect(changeLocaleSpy).toHaveBeenCalledWith(locale);
      });
    });

    describe('createChangeLocaleHandler', () => {
      test('resulting function changes locale', async () => {
        const { result, changeLocaleSpy, push, expectedRoute } = setup({
          locale,
        });

        const handler = result.current.createChangeLocaleHandler(locale);

        await hookAct(async () => {
          await handler();
        });

        expect(changeLocaleSpy).toHaveBeenCalledTimes(1);
        expect(changeLocaleSpy).toHaveBeenCalledWith(locale);

        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith(expectedRoute);
      });
    });
  });
});
