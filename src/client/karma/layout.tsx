import type { NextComponentType, NextPageContext } from 'next';
import type { ReactElement } from 'react';

import { IsomorphicKarma } from './Isomorphic';
import type { IsomorphicKarmaProps } from './types';

/**
 * Patched `NextComponentType` to support attaching `.Layout` component in `_app`
 *
 * @see https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export type KarmaComponent = NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  Record<string, unknown>
> & {
  withLayout?: (
    page: ReactElement,
    karma?: IsomorphicKarmaProps
  ) => JSX.Element;
};

export type LayoutCreator = (page: ReactElement) => JSX.Element;

export const layoutWithKarma =
  (createLayout: LayoutCreator) =>
  (page: ReactElement, karma: IsomorphicKarmaProps): JSX.Element =>
    <IsomorphicKarma karma={karma}>{createLayout(page)}</IsomorphicKarma>;
