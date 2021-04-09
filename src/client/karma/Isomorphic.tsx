import { KarmaSSG } from './SSG';
import { KarmaSSR } from './SSR';
import type { IsomorphicKarmaProps, WithChildren } from './types';

type PropsWithKarma<
  Props extends Record<string, unknown> = Record<string, unknown>
> = Props & {
  karma?: IsomorphicKarmaProps;
};

export function IsomorphicKarma({
  children,
  karma,
}: PropsWithKarma<WithChildren>): JSX.Element {
  if (karma) {
    if ('cookies' in karma) {
      return <KarmaSSR {...karma}>{children}</KarmaSSR>;
    }

    return <KarmaSSG {...karma}>{children}</KarmaSSG>;
  }

  // @ts-expect-error children might be invalid, but that's user error and
  // should throw. using `isValidElement` here would be unnecessary
  return children;
}
