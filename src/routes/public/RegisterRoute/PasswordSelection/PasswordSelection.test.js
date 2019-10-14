import React from 'react';
import PasswordSelection from '.';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

afterEach(cleanup);

const validPassword = 'a1234567';

const defaultProps = {
  isLoading: false,
  error: null,
  password: '',
  confirmPassword: '',
  handleChange: jest.fn(),
};

describe('<PasswordSelection />', () => {
  it('renders successfully', () => {
    const { getByLabelText } = render(<PasswordSelection {...defaultProps} />);

    const passwordInput = getByLabelText('Password');
    const confirmPasswordInput = getByLabelText('Confirm password');

    expect(passwordInput.disabled).toBe(false);
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.disabled).toBe(true);
  });

  it('toggles input type on faEye click', () => {
    const { container, getByLabelText } = render(
      <PasswordSelection {...defaultProps} />,
    );

    const passwordInput = getByLabelText('Password');
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

  it('changes progress state depending on password security', () => {
    const { container, getByLabelText, rerender } = render(
      <PasswordSelection {...defaultProps} />,
    );

    const passwordInput = getByLabelText('Password');
    const progress = container.querySelector('progress');

    expect(parseInt(progress.getAttribute('value'))).toBe(0);
    expect(progress.classList.contains('is-warning')).toBe(true);

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

    expect(parseInt(progress.getAttribute('value'))).toBe(1);
    expect(progress.classList.contains('is-danger')).toBe(true);

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

    expect(parseInt(progress.getAttribute('value'))).toBe(2);
    expect(progress.classList.contains('is-warning')).toBe(true);

    act(() => {
      fireEvent.input(passwordInput, {
        target: { value: validPassword },
      });
    });

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(3);

    rerender(
      <PasswordSelection {...{ ...defaultProps, password: validPassword }} />,
    );

    expect(parseInt(progress.getAttribute('value'))).toBe(3);
    expect(progress.classList.contains('is-success')).toBe(true);
  });
});
