import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';

import MailInUseWarning from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<MailInUseWarning />', () => {
  it('renders without crashing', () => {
    render(<MailInUseWarning />);
  });
});
