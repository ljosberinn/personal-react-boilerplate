import { render } from '@testing-library/react';
import React from 'react';

import Login from './Login';

describe('<Login />', () => {
  it('should render without crashing', () => {
    render(<Login />);
  });
});
