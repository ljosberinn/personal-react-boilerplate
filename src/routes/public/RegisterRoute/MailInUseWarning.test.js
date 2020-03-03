import React from 'react';

import render, { defineIntersectionObserver } from '../../../utils/testUtils';
import MailInUseWarning from './MailInUseWarning';

defineIntersectionObserver();

describe('<MailInUseWarning />', () => {
  it('renders without crashing', () => {
    render(<MailInUseWarning />);
  });
});
