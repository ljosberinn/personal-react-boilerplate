import i18n from 'i18next';
import React from 'react';

import {
  render,
  fireEvent,
  waitFor,
  screen,
  testA11Y,
} from '../../../../../testUtils';
import { mockConsoleMethods } from '../../../../../testUtils/console';
import { ENABLED_LANGUAGES } from '../../../../constants';
import { i18nCache } from '../../../../server/i18n/cache';

import { LanguageSwitch } from '.';

const setup = () => {
  render(<LanguageSwitch />);

  const button = screen.getByRole('button');

  // actually open the menu as other elements are not rendered before
  fireEvent.click(button);

  const currentLanguage = ENABLED_LANGUAGES.find(
    (slug) => i18n.language === slug
  )!;

  const otherLanguages = ENABLED_LANGUAGES.filter(
    (slug) => slug !== currentLanguage
  );

  const randomOtherLanguage =
    otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

  return { button, currentLanguage, randomOtherLanguage };
};

const makeGetDataByLanguageSpy = (bool: boolean) =>
  jest
    .spyOn(i18n, 'getDataByLanguage')
    .mockImplementation(() => (bool ? { translation: {} } : undefined));

describe('<LanguageSwitch />', () => {
  let restoreConsole: ReturnType<typeof mockConsoleMethods>;

  beforeEach(() => {
    restoreConsole = mockConsoleMethods('error');
  });

  afterEach(() => {
    restoreConsole();
  });

  it('renders without crashing', () => {
    render(<LanguageSwitch />);
  });

  it('passes a11y test', async () => {
    await testA11Y(<LanguageSwitch />);
  });

  it('should include a request for translation help', () => {
    const { currentLanguage } = setup();

    const cta = screen.getByRole('menuitem', {
      name: i18nCache[currentLanguage].i18n['help-cta'],
    });

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href');
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
});
