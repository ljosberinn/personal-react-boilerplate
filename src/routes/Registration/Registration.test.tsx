import React from 'react';

import { render } from '../../testUtils';
import Registration from './Registration';

describe('<Registration />', () => {
  it('should render without crashing', () => {
    render(<Registration />);
  });
});
