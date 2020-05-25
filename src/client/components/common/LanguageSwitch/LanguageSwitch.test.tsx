import i18n from 'i18next';
import React from 'react';

import { render, fireEvent, waitFor } from '../../../../../testUtils';
import { ENABLED_LANGUAGES } from '../../../../constants';
import LanguageSwitch from './LanguageSwitch';

describe('<LanguageSwitch />', () => {
  it('should render without crashing', () => {
    render(<LanguageSwitch />);
  });

  it('should include a request for translation help', () => {
    const { getByRole } = render(<LanguageSwitch />);

    // actually open the menu as other elements are not rendered before
    const btn = getByRole('button');
    fireEvent.click(btn);

    const cta = getByRole('menuitem', { name: 'help-cta' });

    expect(cta).toBeInTheDocument();
    expect(cta.getAttribute('href')).not.toBe(undefined);
  });

  it('should always change the language on click', async () => {
    const { getByRole } = render(<LanguageSwitch />);

    // actually open the menu as other elements are not rendered before
    const btn = getByRole('button');
    fireEvent.click(btn);

    const currentLanguage = ENABLED_LANGUAGES.find(
      slug => i18n.language === slug
    )!;

    const otherLanguages = ENABLED_LANGUAGES.filter(
      slug => slug !== currentLanguage
    );

    const randomOtherLanguage =
      otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

    // helper fn
    const getElementByLanguage = (language: string) =>
      getByRole('menuitemradio', { name: language });

    const currentLanguageElement = getElementByLanguage(currentLanguage);

    expect(currentLanguageElement.getAttribute('aria-checked')).toBe('true');
    const otherLanguageElement = getElementByLanguage(randomOtherLanguage);

    expect(otherLanguageElement.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(otherLanguageElement);

    // changing language is async
    await waitFor(() => expect(i18n.language).toBe(randomOtherLanguage));

    // reopen
    fireEvent.click(btn);

    expect(
      getElementByLanguage(currentLanguage).getAttribute('aria-checked')
    ).toBe('false');

    expect(
      getElementByLanguage(randomOtherLanguage).getAttribute('aria-checked')
    ).toBe('true');
  });
});
