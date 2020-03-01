import React from 'react';

import render from '../../utils/testUtils';

import Footer from '.';

describe('<Footer />', () => {
  it('should render without crashing', () => {
    render(<Footer />);
  });
});
