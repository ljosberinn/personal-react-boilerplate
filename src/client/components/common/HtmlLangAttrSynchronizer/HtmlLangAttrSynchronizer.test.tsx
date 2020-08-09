import React from 'react';

import { render } from '../../../../../testUtils';

import { HtmlLangAttrSynchronizer } from '.';

describe('<HtmlLangAttrSynchronizer />', () => {
  it('renders without crashing', () => {
    render(<HtmlLangAttrSynchronizer />);
  });

  it.todo('changes html.lang attribute onLanguageChanged');
});
