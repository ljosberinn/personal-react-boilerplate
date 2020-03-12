import { createMemoryHistory } from 'history';
import i18n from 'i18next';
import React from 'react';

import { ENABLED_LANGUAGES } from '../../constants/env';
import render from '../../utils/testUtils';

import LanguageRoute from '.';

describe('<LanguageRoute />', () => {
  it('should render without crashing && do nothing on "/"', () => {
    render(<LanguageRoute />);
  });

  ENABLED_LANGUAGES.forEach(language => {
    const history = createMemoryHistory({
      initialEntries: [`/${language}`],
    });

    it(`should render without crashing on a matching route (${language}) and change the language`, () => {
      expect(i18n.language).not.toBe(language);
      render(<LanguageRoute />, { history });
      expect(i18n.language).toBe(language);
    });
  });
});
