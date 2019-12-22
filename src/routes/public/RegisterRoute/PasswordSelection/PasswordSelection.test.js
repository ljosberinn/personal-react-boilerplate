import React from 'react';
import { default as Component } from '.';
import { fireEvent, act } from '@testing-library/react';
import render from '../../../../utils/testUtils';
import { withTranslation } from 'react-i18next';

const PasswordSelection = withTranslation()(props => <Component {...props} />);

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
    const { container, getByTestId } = render(
      <PasswordSelection {...defaultProps} />,
    );

    const passwordInput = getByTestId('password');
    const svg = container.querySelector('.fa-eye');

    expect(passwordInput.type).toBe('password');

    act(() => {
      fireEvent.click(svg);
    });

    expect(passwordInput.type).toBe('text');

    act(() => {
      fireEvent.click(svg);
    });

    expect(passwordInput.type).toBe('password');
  });

  it('changes help state depending on password security', () => {
    const { container, getByTestId, rerender } = render(
      <PasswordSelection {...defaultProps} />,
    );

    const passwordInput = getByTestId('password');

    expect(container.querySelectorAll('.help.is-success').length).toBe(0);

    act(() => {
      fireEvent.input(passwordInput, {
        target: { value: validPassword.slice(0, 1) },
      });
    });

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);

    rerender(
      <PasswordSelection
        {...{ ...defaultProps, password: validPassword.slice(0, 1) }}
      />,
    );

    expect(container.querySelectorAll('.help.is-success').length).toBe(1);

    act(() => {
      fireEvent.input(passwordInput, {
        target: { value: validPassword.slice(0, 2) },
      });
    });

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(2);

    rerender(
      <PasswordSelection
        {...{ ...defaultProps, password: validPassword.slice(0, 2) }}
      />,
    );

    expect(container.querySelectorAll('.help.is-success').length).toBe(2);

    act(() => {
      fireEvent.input(passwordInput, {
        target: { value: validPassword },
      });
    });

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(3);

    rerender(
      <PasswordSelection {...{ ...defaultProps, password: validPassword }} />,
    );

    expect(container.querySelectorAll('.help.is-success').length).toBe(3);
  });
});
