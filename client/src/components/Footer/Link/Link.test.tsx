import React from 'react';

import { render } from '../../../testUtils';
import Link from './Link';
import { defaultProps } from './Link.fixture';

describe('<Link />', () => {
  it('should render without crashing', () => {
    render(<Link {...defaultProps} />);
  });
});
