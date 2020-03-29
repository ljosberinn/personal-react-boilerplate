import { renderHook } from '@testing-library/react-hooks';
import React, { PropsWithChildren, isValidElement } from 'react';

import { render, fireEvent } from '../../testUtils';
import NavigationContext, { useNavigationContext } from './NavigationContext';

type EmptyProps = PropsWithChildren<{}>;

function HookWrapper({ children }: EmptyProps) {
  return <NavigationContext>{children}</NavigationContext>;
}

describe('useNavigationContext', () => {
  test('should return the component PreloadingLink ', () => {
    const { result } = renderHook(useNavigationContext, {
      wrapper: HookWrapper,
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
    const { result } = renderHook(useNavigationContext, {
      wrapper: HookWrapper,
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
    const { result } = renderHook(useNavigationContext, {
      wrapper: HookWrapper,
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

  test('PreloadingLink should preload a component onMouseOver', () => {
    const { result } = renderHook(useNavigationContext, {
      wrapper: HookWrapper,
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
    }
  });
});
