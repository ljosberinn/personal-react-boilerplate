import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';

import { AuthContextProvider } from '../../context/AuthContext';
import { AuthContextProviderProps } from '../../context/AuthContext/AuthContextProvider';
import useAuth from './useAuth';

const makeWrapper = (props: Partial<AuthContextProviderProps>) => () => (
  <AuthContextProvider session={null} {...props} />
);

describe('useAuth', () => {
  test('returns null outside of a context provider', () => {
    expect(renderHook(useAuth).result.current).toBe(null);
  });

  test('returns something within a context provider', () => {
    const { result } = renderHook(useAuth, {
      wrapper: makeWrapper({ session: null }),
    });

    expect(typeof result.current).toBe('object');
  });
});
