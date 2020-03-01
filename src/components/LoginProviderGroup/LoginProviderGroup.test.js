import React from 'react';

import render from '../../utils/testUtils';

import LoginProviderGroup from '.';

describe('<LoginProviderGroup />', () => {
  it('should render without crashing', () => {
    render(<LoginProviderGroup />);
  });
});
