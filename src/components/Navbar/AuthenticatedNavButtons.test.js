import React from 'react';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../__mocks__/react-netlify-identity';
import { render } from '../../utils/testUtils';
import AuthenticatedNavButtons from './AuthenticatedNavButtons';

jest.mock('react-netlify-identity');

beforeEach(() => {
  IdentityContextProvider.mockImplementation(mockIdentityContextProvider);

  useIdentityContext.mockReturnValue({});
});
describe('<AuthenticatedNavButtons />', () => {
  it('renders without crashing', () => {
    render(<AuthenticatedNavButtons />);
  });
});
