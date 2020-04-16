import * as React from 'react';

import { render } from '../../testUtils';
import Settings from './Settings';

describe('<Settings />', () => {
  it('should render without crashing', () => {
    render(<Settings />);
  });
});
