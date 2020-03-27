import { render } from '@testing-library/react';
import React from 'react';

import Registration from './Registration';

describe('<Registration />', () => {
  it('should render without crashing', () => {
    render(<Registration />);
  });
});
