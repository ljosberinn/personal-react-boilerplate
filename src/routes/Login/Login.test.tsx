import React from 'react';

import { render } from '../../testUtils';
import Login from './Login';

describe('<Login />', () => {
  it('should render without crashing', () => {
    render(<Login />);
  });
});
