import * as React from 'react';

import { render } from '../../testUtils';
import Footer from './Footer';

describe('<Footer />', () => {
  it('should render without crashing', () => {
    render(<Footer />);
  });
});
