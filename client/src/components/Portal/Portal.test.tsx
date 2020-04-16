import * as React from 'react';

import { render } from '../../testUtils';
import Portal from './Portal';

const defaultProps = {
  id: 'some-id',
  children: <h1 data-testid="headline">hello friend</h1>,
};

describe('<Portal />', () => {
  it('should render without crashing given default props', () => {
    render(<Portal {...defaultProps} />);
  });
});
