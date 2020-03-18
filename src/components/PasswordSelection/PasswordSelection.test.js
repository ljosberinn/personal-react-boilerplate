import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render, fireEvent } from '../../utils/testUtils';

import PasswordSelection from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const validPassword = 'a1234567';

const defaultProps = {
  isLoading: false,
  error: null,
  password: '',
  confirmPassword: '',
  handleChange: jest.fn(),
};

describe('<PasswordSelection />', () => {
  test('renders successfully', () => {
    const { getByTestId } = render(<PasswordSelection {...defaultProps} />);

    const passwordInput = getByTestId('password');
    const confirmPasswordInput = getByTestId('confirm-password');

    expect(passwordInput.disabled).toBe(false);
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.disabled).toBe(true);
  });

  test('toggles input type on faEye click', () => {
    const { getByTestId } = render(<PasswordSelection {...defaultProps} />);

    const passwordInput = getByTestId('password');
    const svg = getByTestId('toggle-input-type-icon');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(svg);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(svg);
    expect(passwordInput.type).toBe('password');
  });

  it('changes help state depending on password security', () => {
    const { container, rerender } = render(
      <PasswordSelection {...defaultProps} />,
    );

    const passwordCriteriaClasses = '.help.is-success';

    expect(container.querySelectorAll(passwordCriteriaClasses).length).toBe(0);

    rerender(
      <PasswordSelection
        {...{ ...defaultProps, password: validPassword.substr(0, 1) }}
      />,
    );

    expect(container.querySelectorAll(passwordCriteriaClasses).length).toBe(1);

    rerender(
      <PasswordSelection
        {...{ ...defaultProps, password: validPassword.substr(0, 2) }}
      />,
    );

    expect(container.querySelectorAll(passwordCriteriaClasses).length).toBe(2);

    rerender(
      <PasswordSelection {...{ ...defaultProps, password: validPassword }} />,
    );

    expect(container.querySelectorAll(passwordCriteriaClasses).length).toBe(3);
  });
});
