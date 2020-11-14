import { cookieStorageManager } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { KarmaCore } from './Core';
import type { WithChildren, KarmaCoreProps } from './types';

export type KarmaSSRProps = Omit<KarmaCoreProps, 'mode'> & {
  cookies: string;
};

export function KarmaSSR({
  children,
  cookies,
  ...rest
}: WithChildren<KarmaSSRProps>): JSX.Element | null {
  const shouldRedirect = useDetermineShouldRedirect(rest.auth);

  if (shouldRedirect) {
    return null;
  }

  const colorModeManager = cookieStorageManager(cookies);

  return (
    <KarmaCore {...rest} colorModeManager={colorModeManager} mode="ssr">
      {children}
    </KarmaCore>
  );
}

type UsePseudoSSRRedirectArgs = KarmaSSRProps['auth'];

/**
 * workaround for redirecting client side when navigation to a
 * protected/redirecting site without session occurs
 *
 * @see https://github.com/vercel/next.js/discussions/11281#discussioncomment-2384
 */
function useDetermineShouldRedirect({
  redirectDestinationIfUnauthenticated,
  session,
}: UsePseudoSSRRedirectArgs): boolean {
  const { replace } = useRouter();
  /**
   * redirect if:
   *
   * - no `session` present
   * - `redirectDestinationIfUnauthenticated` is given
   */
  const shouldRedirect = !session && !!redirectDestinationIfUnauthenticated;

  useEffect(() => {
    if (!shouldRedirect || !redirectDestinationIfUnauthenticated) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        await replace(redirectDestinationIfUnauthenticated);
      } catch {
        window.location.assign(redirectDestinationIfUnauthenticated);
      }
    })();
  }, [shouldRedirect, redirectDestinationIfUnauthenticated, replace]);

  return shouldRedirect;
}
