import * as React from 'react';

import { render } from '../../testUtils';
import Tos from './Tos';

describe('<Tos />', () => {
  it('should render without crashing', () => {
    render(<Tos />);
  });
});
