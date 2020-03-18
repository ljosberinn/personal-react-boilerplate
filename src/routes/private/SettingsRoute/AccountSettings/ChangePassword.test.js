import React from 'react';
import { act } from 'react-dom/test-utils';
import { useIdentityContext } from 'react-netlify-identity';

import { render, fireEvent, waitFor } from '../../../../utils/testUtils';
import ChangePassword from './ChangePassword';

jest.mock('react-netlify-identity');

let mockUpdateUser = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  useIdentityContext.mockReturnValue({
    isLoggedIn: true,
    updateUser: mockUpdateUser,
  });
});

const validPassword = '1abcdefg';

describe('<ChangePassword />', () => {
  it('renders without crashing', () => {
    render(<ChangePassword />);
  });

  it('renders a specific error if the refresh token was invalid', async () => {
    mockUpdateUser.mockImplementationOnce(() =>
      Promise.reject({
        json: {
          error_description: 'Invalid Refresh Token',
        },
      }),
    );

    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});

    const { getByTestId, queryByTestId } = render(<ChangePassword />);

    const password = getByTestId('password');
    const confirmPassword = getByTestId('confirm-password');
    const submit = getByTestId('change-password-submit');

    expect(queryByTestId('change-password-error')).toBe(null);
    expect(submit.disabled).toBe(true);

    fireEvent.change(password, { target: { value: validPassword } });
    expect(submit.disabled).toBe(true);

    fireEvent.change(confirmPassword, { target: { value: validPassword } });
    expect(submit.disabled).toBe(false);

    fireEvent.click(submit);

    await waitFor(() => getByTestId('change-password-error'));

    expect(getByTestId('change-password-error')).toBeInTheDocument();

    console.error.mockRestore();
  });

  it('renders a success message if the request was successful', async () => {
    mockUpdateUser.mockImplementationOnce(() => Promise.resolve());
    // SuccessfulPasswordChange uses react-countup
    jest.useFakeTimers();

    const { getByTestId, queryByTestId } = render(<ChangePassword />);

    const password = getByTestId('password');
    const confirmPassword = getByTestId('confirm-password');
    const submit = getByTestId('change-password-submit');

    expect(queryByTestId('change-password-error')).toBe(null);
    expect(submit.disabled).toBe(true);

    fireEvent.change(password, { target: { value: validPassword } });
    expect(submit.disabled).toBe(true);

    fireEvent.change(confirmPassword, { target: { value: validPassword } });
    expect(submit.disabled).toBe(false);

    fireEvent.click(submit);

    expect(queryByTestId('change-password-error')).toBe(null);

    await waitFor(() => getByTestId('successful-password-change'));

    act(() => {
      jest.runAllTimers();
    });

    expect(queryByTestId('change-password-error')).toBe(null);
  });
});
