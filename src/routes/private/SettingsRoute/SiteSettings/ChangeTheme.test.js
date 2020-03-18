import React from 'react';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../../../__mocks__/react-netlify-identity';
import { render } from '../../../../utils/testUtils';
import ChangeTheme from './ChangeTheme';

jest.mock('react-netlify-identity');

beforeEach(() => {
  jest.clearAllMocks();

  IdentityContextProvider.mockImplementationOnce(mockIdentityContextProvider);

  useIdentityContext.mockReturnValue({});
});

describe('<ChangeTheme />', () => {
  it('renders without crashing', () => {
    render(<ChangeTheme />);
  });
});
