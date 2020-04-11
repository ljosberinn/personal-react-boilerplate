import { renderHook } from '@testing-library/react-hooks';
import React, { PropsWithChildren, isValidElement } from 'react';

import { Auth0ContextDefinition } from '../../context/Auth0/context';
import { NavigationProvider } from '../../context/Navigation';
import { render, fireEvent } from '../../testUtils';
import { createAuthWrapper } from '../../testUtils/authWrapper';
import useNavigation from './useNavigation';

const createAuthHookWrapper = (values?: Partial<Auth0ContextDefinition>) => ({
  children,
}: PropsWithChildren<{}>) => {
  const AuthWrapper = createAuthWrapper(values);

  return (
    <AuthWrapper>
      <NavigationProvider>{children}</NavigationProvider>
    </AuthWrapper>
  );
};

describe('useNavigation', () => {
  test('should return the component PreloadingLink ', () => {
    const { result } = renderHook(useNavigation, {
      wrapper: createAuthHookWrapper(),
    });

    const PreloadingLink = result.current?.PreloadingLink;
    const route = result.current?.routes[0];

    expect(typeof PreloadingLink).toBe('function');

    if (PreloadingLink && route) {
      expect(
        isValidElement(<PreloadingLink to={route}>hello friend</PreloadingLink>)
      ).toBe(true);
    }
  });

  test('PreloadingLink should return a HTMLAnchorElement', () => {
    const { result } = renderHook(useNavigation, {
      wrapper: createAuthHookWrapper(),
    });

    const PreloadingLink = result.current?.PreloadingLink;
    const route = result.current?.routes[0];

    if (PreloadingLink && route) {
      const { getByText } = render(
        <PreloadingLink to={route}>hello friend</PreloadingLink>,
        {
          includeTranslation: false,
        }
      );

      const link = getByText(/hello friend/) as HTMLAnchorElement;

      expect(link.tagName).toBe('A');
    }
  });

  test('PreloadingLink should link to the given route', () => {
    const { result } = renderHook(useNavigation, {
      wrapper: createAuthHookWrapper(),
    });

    const PreloadingLink = result.current?.PreloadingLink;

    const route = result.current?.routes[0];

    if (PreloadingLink && route) {
      const { getByText } = render(
        <PreloadingLink to={route}>hello friend</PreloadingLink>,
        {
          includeTranslation: false,
        }
      );

      const link = getByText(/hello friend/) as HTMLAnchorElement;

      expect(link.href).toBe(`http://localhost${route.path.client()}`);
    }
  });

  test('PreloadingLink should preload a component onMouseOver, once', () => {
    const { result } = renderHook(useNavigation, {
      wrapper: createAuthHookWrapper(),
    });

    const PreloadingLink = result.current?.PreloadingLink;

    const route = result.current?.routes[0];

    if (PreloadingLink && route) {
      const mockedPreload = jest.fn();

      const fakeRoute = {
        ...route,
        component: { ...route.component, preload: mockedPreload },
      };

      const { getByText } = render(
        // @ts-expect-error
        <PreloadingLink to={fakeRoute}>hello friend</PreloadingLink>,
        {
          includeTranslation: false,
        }
      );

      const link = getByText(/hello friend/) as HTMLAnchorElement;

      expect(fakeRoute.component.preload).not.toHaveBeenCalled();

      fireEvent.mouseOver(link);

      expect(fakeRoute.component.preload).toHaveBeenCalledTimes(1);

      fireEvent.mouseOver(link);

      expect(fakeRoute.component.preload).toHaveBeenCalledTimes(1);
    }
  });

  test('should not expose private routes when logged in', () => {
    const { result } = renderHook(useNavigation, {
      wrapper: createAuthHookWrapper({ isAuthenticated: false }),
    });

    expect(result.current.routes.DASHBOARD).toBe(undefined);
    expect(result.current.routes.INDEX).not.toBe(undefined);
  });

  test('should expose private routes when logged in', () => {
    const { result } = renderHook(useNavigation, {
      wrapper: createAuthHookWrapper({ isAuthenticated: true }),
    });

    expect(result.current.routes.DASHBOARD).not.toBe(undefined);
    expect(result.current.routes.INDEX).toBe(undefined);
  });

  test('should always expose shared routes regardless of auth', () => {
    [true, false].forEach(bool => {
      const { result } = renderHook(useNavigation, {
        wrapper: createAuthHookWrapper({ isAuthenticated: bool }),
      });

      expect(result.current.routes.PRIVACY_POLICY).not.toBe(undefined);
    });
  });
});
