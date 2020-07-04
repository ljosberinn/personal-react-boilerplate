import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import { waitFor } from '../../../../testUtils';
import { AuthContextProvider } from '../../context/AuthContext';
import useAuth from './useAuth';

describe('hooks/useAuth', () => {
  test('executes without crashing', () => {
    renderHook(useAuth);
  });

  test('defaults to null given no user', () => {
    const {
      result: { current },
    } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    expect(current.user).toBe(null);
    expect(current.isAuthenticated).toBeFalsy();
  });

  test('exposes user when passed', () => {
    const user = { id: '1', name: 'ljosberinn' };

    const {
      result: { current },
    } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={user}>{children}</AuthContextProvider>
      ),
    });

    expect(current.user).toBe(user);
    expect(current.isAuthenticated).toBeTruthy();
  });

  test('on logout, dispatches a delete request', async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, status: 200 }));

    const user = { id: '1', name: 'ljosberinn' };

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={user}>{children}</AuthContextProvider>
      ),
    });

    expect(result.current.user).toBe(user);

    await act(result.current.logout);

    expect(global.fetch).toHaveBeenCalledWith('/api/v1/auth/logout', {
      method: 'DELETE',
    });

    await waitFor(() => expect(result.current.user).toBe(null));

    // @ts-expect-error
    global.fetch = undefined;
  });
});
