import { render } from '@testing-library/react';
import React from 'react';

import Settings from './Settings';

describe('<Settings />', () => {
  it('should render without crashing', () => {
    render(<Settings />);
  });
});
