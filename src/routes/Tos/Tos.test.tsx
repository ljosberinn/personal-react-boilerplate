import { render } from '@testing-library/react';
import React from 'react';

import Tos from './Tos';

describe('<Tos />', () => {
  it('should render without crashing', () => {
    render(<Tos />);
  });
});
