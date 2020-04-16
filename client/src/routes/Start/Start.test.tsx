import * as React from 'react';

import { render } from '../../testUtils';
import Start from './Start';

describe('<Start />', () => {
  it('should render without crashing', () => {
    render(<Start />);
  });
});
