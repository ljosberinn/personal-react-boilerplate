import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Error from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<Error />', () => {
  it('should render without crashing', () => {
    render(<Error>hello friend</Error>);
  });

  it('should always have the color "danger"', () => {
    const { getByTestId } = render(<Error>hello friend</Error>);

    expect(getByTestId('error').classList.contains('is-danger')).toBe(true);
  });

  it('should always have the role "alert"', () => {
    const { getByTestId } = render(<Error>hello friend</Error>);

    expect(getByTestId('error').getAttribute('role')).toBe('alert');
  });
});
