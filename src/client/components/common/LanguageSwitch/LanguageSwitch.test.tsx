import i18n from 'i18next';
import React from 'react';

import { render, fireEvent, waitFor } from '../../../../../testUtils';
import { ENABLED_LANGUAGES } from '../../../../constants';
import i18nCache from '../../../../server/i18n';
import LanguageSwitch from './LanguageSwitch';

const findCurrentLanguage = () =>
  ENABLED_LANGUAGES.find(slug => i18n.language === slug)!;

describe('<LanguageSwitch />', () => {
  it('should render without crashing', () => {
    render(<LanguageSwitch />);
  });

  it('should include a request for translation help', () => {
    const { getByRole } = render(<LanguageSwitch />);

    // actually open the menu as other elements are not rendered before
    const btn = getByRole('button');
    fireEvent.click(btn);

    const currentLanguage = findCurrentLanguage();

    const cta = getByRole('menuitem', {
      name: i18nCache[currentLanguage].i18n['help-cta'],
    });

    expect(cta).toBeInTheDocument();
    expect(cta.getAttribute('href')).toBeDefined();
  });

  it('should always change the language on click', async () => {
    const { getByRole } = render(<LanguageSwitch />);

    // actually open the menu as other elements are not rendered before
    const btn = getByRole('button');
    fireEvent.click(btn);

    const currentLanguage = findCurrentLanguage();

    const otherLanguages = ENABLED_LANGUAGES.filter(
      slug => slug !== currentLanguage
    );

    const randomOtherLanguage =
      otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

    // e.g. i18n.en.i18n.en
    const currentLanguageElement = getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[currentLanguage],
    });
    expect(currentLanguageElement.getAttribute('aria-checked')).toBe('true');

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });
    expect(otherLanguageElement.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(otherLanguageElement);

    // changing language is async
    await waitFor(() => expect(i18n.language).toBe(randomOtherLanguage));

    // reopen
    fireEvent.click(btn);

    expect(
      // i18n.de.i18n.en
      getByRole('menuitemradio', {
        name: i18nCache[randomOtherLanguage].i18n[currentLanguage],
      }).getAttribute('aria-checked')
    ).toBe('false');

    expect(
      // i18n.de.i18n.de
      getByRole('menuitemradio', {
        name: i18nCache[randomOtherLanguage].i18n[randomOtherLanguage],
      }).getAttribute('aria-checked')
    ).toBe('true');
  });
});
