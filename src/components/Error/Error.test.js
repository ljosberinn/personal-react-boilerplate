import React from 'react';

import render from '../../utils/testUtils';

import Error from '.';

describe('<Error />', () => {
  it('should render without crashing', () => {
    render(<Error />);
  });

  it('should always have the color "danger"', () => {
    const { getByTestId } = render(<Error />);

    expect(getByTestId('error').classList.contains('is-danger')).toBe(true);
  });

  it('should always have the role "alert"', () => {
    const { getByTestId } = render(<Error />);

    expect(getByTestId('error').getAttribute('role')).toBe('alert');
  });
});
