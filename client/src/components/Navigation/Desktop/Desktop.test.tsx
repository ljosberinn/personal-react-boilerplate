import * as React from 'react';

import { render } from '../../../testUtils';
import Desktop from './Desktop';

describe('<Desktop />', () => {
  it('should render without crashing', () => {
    render(<Desktop />);
  });
});
