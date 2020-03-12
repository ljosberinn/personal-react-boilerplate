import React from 'react';

import render from '../../../utils/testUtils';
import MailInUseWarning from './MailInUseWarning';

describe('<MailInUseWarning />', () => {
  it('renders without crashing', () => {
    render(<MailInUseWarning />);
  });
});
