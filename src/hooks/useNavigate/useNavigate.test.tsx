import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { PropsWithChildren } from 'react';
import React from 'react';
import { Router } from 'react-router-dom';

import useNavigate from './useNavigate';

describe('useNavigate', () => {
  test('should execute without crashing', () => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
    });

    function Wrapper({ children }: PropsWithChildren<{}>) {
      return <Router history={history}>{children}</Router>;
    }

    renderHook(useNavigate, {
      wrapper: Wrapper,
    });
  });

  test('should return a function', () => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
    });

    function Wrapper({ children }: PropsWithChildren<{}>) {
      return <Router history={history}>{children}</Router>;
    }

    const { result } = renderHook(useNavigate, {
      wrapper: Wrapper,
    });

    expect(typeof result.current).toBe('function');
  });

  test('should allow navigating', () => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
    });

    function Wrapper({ children }: PropsWithChildren<{}>) {
      return <Router history={history}>{children}</Router>;
    }

    const { result } = renderHook(useNavigate, {
      wrapper: Wrapper,
    });

    expect(history.location.pathname).toBe('/');

    result.current('/hello-friend');

    expect(history.location.pathname).toBe('/hello-friend');
    expect(history.action).toBe('PUSH');
  });
});
