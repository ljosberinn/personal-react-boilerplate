import React from 'react';

import render from '../../../../utils/testUtils';

import MailInUseWarning from '.';

describe('<MailInUseWarning />', () => {
  it('renders without crashing', () => {
    render(<MailInUseWarning />);
  });
});
