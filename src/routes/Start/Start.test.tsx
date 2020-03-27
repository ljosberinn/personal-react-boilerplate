import { render } from '@testing-library/react';
import React from 'react';

import Start from './Start';

describe('<Start />', () => {
  it('should render without crashing', () => {
    render(<Start />);
  });
});
