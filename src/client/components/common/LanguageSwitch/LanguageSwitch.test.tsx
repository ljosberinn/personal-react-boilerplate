import { COOKIE_LOOKUP_KEY_LANG } from '@unly/universal-language-detector';
import i18n from 'i18next';
import cookies from 'js-cookie';
import React from 'react';

import { render, fireEvent, waitFor, screen } from '../../../../../testUtils';
import i18nInstance from '../../../../../testUtils/i18n';
import { ENABLED_LANGUAGES } from '../../../../constants';
import i18nCache from '../../../../server/i18n';
import * as clientSideI18n from '../../../i18n';
import LanguageSwitch from './LanguageSwitch';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const setup = () => {
  render(<LanguageSwitch />);

  const button = screen.getByRole('button');

  // actually open the menu as other elements are not rendered before
  fireEvent.click(button);

  const currentLanguage = ENABLED_LANGUAGES.find(
    slug => i18n.language === slug
  )!;

  const otherLanguages = ENABLED_LANGUAGES.filter(
    slug => slug !== currentLanguage
  );

  const randomOtherLanguage =
    otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

  return { button, currentLanguage, randomOtherLanguage };
};

const makeGetDataByLanguageSpy = (bool: boolean) =>
  jest
    .spyOn(i18nInstance, 'getDataByLanguage')
    .mockImplementation(() => (bool ? { translation: {} } : undefined));

describe('<LanguageSwitch />', () => {
  it('should render without crashing', () => {
    render(<LanguageSwitch />);
  });

  it('should include a request for translation help', () => {
    const { currentLanguage } = setup();

    const cta = screen.getByRole('menuitem', {
      name: i18nCache[currentLanguage].i18n['help-cta'],
    });

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href');
  });

  it('verifies bundle existence on i18n on languageChanged', async () => {
    const mockHasResourceBundle = makeGetDataByLanguageSpy(true);

    const { currentLanguage, randomOtherLanguage } = setup();

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    fireEvent.click(otherLanguageElement);

    await waitFor(() =>
      expect(mockHasResourceBundle).toHaveBeenLastCalledWith(
        randomOtherLanguage
      )
    );
  });

  it('appends new bundles to i18n on languageChanged', async () => {
    const mockHasResourceBundle = makeGetDataByLanguageSpy(false);
    const mockAddResourceBundle = jest.spyOn(i18nInstance, 'addResourceBundle');

    const { currentLanguage, randomOtherLanguage } = setup();

    const mockGetI18N = jest
      .spyOn(clientSideI18n, 'getI18N')
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolve({
              i18n: {},
            });
          })
      );

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    fireEvent.click(otherLanguageElement);

    await waitFor(() =>
      expect(mockHasResourceBundle).toHaveBeenLastCalledWith(
        randomOtherLanguage
      )
    );
    await waitFor(() => expect(mockGetI18N).toHaveBeenCalledTimes(1));

    expect(mockGetI18N).toHaveBeenCalledWith(randomOtherLanguage);
    expect(mockAddResourceBundle).toHaveBeenCalledTimes(1);
  });

  it('attempts to store language preference in cookie on languageChanged', async () => {
    makeGetDataByLanguageSpy(true);

    const mockSet = jest.spyOn(cookies, 'set');

    const { currentLanguage, randomOtherLanguage } = setup();

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    fireEvent.click(otherLanguageElement);

    await waitFor(() =>
      expect(mockSet).toHaveBeenCalledWith(
        COOKIE_LOOKUP_KEY_LANG,
        randomOtherLanguage
      )
    );
  });

  it('changes the language on click', async () => {
    makeGetDataByLanguageSpy(true);

    const { button, currentLanguage, randomOtherLanguage } = setup();

    // e.g. i18n.en.i18n.en
    const currentLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[currentLanguage],
    });

    expect(currentLanguageElement).toBeChecked();

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });
    expect(otherLanguageElement).not.toBeChecked();

    fireEvent.click(otherLanguageElement);

    // changing language is async
    await waitFor(() => expect(i18n.language).toBe(randomOtherLanguage));

    // reopen
    fireEvent.click(button);

    expect(
      // i18n.de.i18n.en
      screen.getByRole('menuitemradio', {
        name: i18nCache[randomOtherLanguage].i18n[currentLanguage],
      })
    ).not.toBeChecked();

    expect(
      // i18n.de.i18n.de
      screen.getByRole('menuitemradio', {
        name: i18nCache[randomOtherLanguage].i18n[randomOtherLanguage],
      })
    ).toBeChecked();
  });

  it('changes the "lang" attribute on <html>', async () => {
    const qsSpy = jest.spyOn(document, 'querySelector');
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const { currentLanguage, randomOtherLanguage } = setup();

    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    fireEvent.click(otherLanguageElement);

    await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));
    expect(setAttributeSpy).toHaveBeenCalledWith('lang', randomOtherLanguage);
  });

  it('changes the "dir" attribute on <html>', async () => {
    const qsSpy = jest.spyOn(document, 'querySelector');
    const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

    const { currentLanguage, randomOtherLanguage } = setup();

    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    fireEvent.click(otherLanguageElement);

    await waitFor(() => expect(qsSpy).toHaveBeenLastCalledWith('html'));
    expect(setAttributeSpy).toHaveBeenCalledWith('dir', expect.any(String));
  });
});
