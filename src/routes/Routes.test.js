import React from 'react';

import { render } from '../utils/testUtils';

import Routes from '.';

describe('<Routes />', () => {
  it('should render without crashing', () => {
    render(<Routes />);
  });
});
