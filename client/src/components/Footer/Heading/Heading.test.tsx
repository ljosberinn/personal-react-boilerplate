import React from 'react';

import { render } from '../../../testUtils';
import Heading from './Heading';

describe('<Heading />', () => {
  it('should render without crashing', () => {
    render(<Heading />);
  });
});
