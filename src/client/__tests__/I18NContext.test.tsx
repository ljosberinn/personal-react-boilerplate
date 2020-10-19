import { render, screen } from '@testing-library/react';

import { mockConsoleMethods } from '../../../testUtils/console';
import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE } from '../../constants';
import { I18NContextProvider, useTranslation } from '../context/I18NContext';

const ns = 'i18n';
const key = 'language-toggle';

describe('<I18NContextProvder />', () => {
  test('given no bundle, returns given key', () => {
    function MockComponent() {
      const { t } = useTranslation();

      return (
        <div>
          <span>{t([ns, key])}</span>
          <span>{t(`${ns}:${key}`)}</span>
        </div>
      );
    }

    render(
      // @ts-expect-error intentional omission of `bundle`
      <I18NContextProvider language={FALLBACK_LANGUAGE}>
        <MockComponent />
      </I18NContextProvider>
    );

    expect(screen.getAllByText(`${ns}:${key}`)).toHaveLength(2);
  });

  test('allows nested lookups when not passing a namespace to useTranslation', () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    function MockComponent() {
      const { t } = useTranslation();

      return (
        <div>
          <span>{t([ns, key])}</span>
          <span>{t(`${ns}:${key}`)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider language={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expectedText = i18nCache[FALLBACK_LANGUAGE][ns]![key];

    expect(screen.getAllByText(expectedText)).toHaveLength(2);
  });

  test('allows nested lookups when passing a namespace to useTranslation', () => {
    function MockComponent() {
      const { t } = useTranslation(ns);

      return (
        <div>
          <span>{t(key)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider language={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expectedText = i18nCache[FALLBACK_LANGUAGE][ns]![key];

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  test('allows accessing a different namespace than passed to useTranslation', () => {
    const otherNs = 'serviceWorker';
    const otherKey = 'newVersion';

    function MockComponent() {
      const { t } = useTranslation(ns);

      return (
        <div>
          <span>{t(key)}</span>
          <span>{t([otherNs, otherKey])}</span>
          <span>{t(`${otherNs}:${otherKey}`)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider language={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expectedText = i18nCache[FALLBACK_LANGUAGE][ns]![key];
    const other = i18nCache[FALLBACK_LANGUAGE][otherNs]![otherKey];

    expect(screen.getAllByText(other)).toHaveLength(2);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  test('warns once for each missing key', () => {
    const { restoreConsole } = mockConsoleMethods('warn');

    const invalidKey1 = 'foo:bar';
    const invalidKey2 = 'foo';

    function MockComponent() {
      const { t } = useTranslation();

      return (
        <div>
          <span>{t(invalidKey1)}</span>
          <span>{t(invalidKey1)}</span>

          <span>{t(invalidKey2)}</span>
          <span>{t(invalidKey2)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider language={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledTimes(2);

    expect(screen.getAllByText(invalidKey1)).toHaveLength(2);
    expect(screen.getAllByText(invalidKey2)).toHaveLength(2);

    restoreConsole();
  });

  test('initially sets html.lang attribute', () => {
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    render(
      <I18NContextProvider language={FALLBACK_LANGUAGE} resources={i18nCache}>
        <h1>test</h1>
      </I18NContextProvider>
    );

    expect(setAttributeSpy).toHaveBeenCalledWith('lang', FALLBACK_LANGUAGE);
  });

  test.todo(
    'always changes html.lang attribute on language change' // , () => {
    // const qsSpy = jest.spyOn(document, 'querySelector');
    // const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');
    // const instance = initI18Next({
    //   bundle: i18nCache[FALLBACK_LANGUAGE],
    //   language: FALLBACK_LANGUAGE,
    // });
    // const otherLanguage = 'de';
    // await instance.changeLanguage(otherLanguage);
    // await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));
    // expect(setAttributeSpy).toHaveBeenCalledWith('lang', otherLanguage);
    // }
  );

  ['en', 'ar'].forEach((language) => {
    // const dir = language === 'en' ? 'ltr' : 'rtl';

    test.todo(
      `always changes the html.dir attribute onLanguageChanged (language: ${language})` // ,
      // async () => {
      // const qsSpy = jest.spyOn(document, 'querySelector');
      // const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');
      // const instance = initI18Next({
      //   bundle: i18nCache[language],
      //   language,
      // });
      // await instance.changeLanguage(language);
      // await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));
      // expect(setAttributeSpy).toHaveBeenCalledWith('dir', dir);
      // }
    );
  });
});
