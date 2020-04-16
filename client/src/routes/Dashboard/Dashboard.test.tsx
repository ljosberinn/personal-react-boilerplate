import * as React from 'react';

import { render } from '../../testUtils';
import Dashboard from './Dashboard';

describe('<Dashboard />', () => {
  it('should render without crashing', () => {
    render(<Dashboard />);
  });
});
