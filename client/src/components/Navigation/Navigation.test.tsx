import * as React from 'react';

import { render } from '../../testUtils';
import Navigation from './Navigation';

describe('<Navigation />', () => {
  it('should render without crashing', () => {
    render(<Navigation />);
  });
});
