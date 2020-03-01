import React from 'react';

import render from '../../utils/testUtils';

import LanguageSwitch, { validOrigins } from '.';

describe('<LanguageSwitch />', () => {
  validOrigins.forEach(origin =>
    it(`should render without crashing - origin ${origin}`, () => {
      render(<LanguageSwitch from={origin} />);
    }),
  );
});
