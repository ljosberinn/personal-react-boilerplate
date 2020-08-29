import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/core';
import { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';

import { WithChildren } from '../../../karma/client/Karma';

export type InternalLinkProps =
  // enforce having children
  WithChildren &
    // `href` is included in `NextLinkProps`, `children` are taken care of
    Omit<ChakraLinkProps, 'href' | 'children'> &
    // `passHref` must be passed, `as` is proxied to not collide with chakras as
    Omit<NextLinkProps, 'passHref' | 'as'> & {
      linkAs?: NextLinkProps['as'];
    };

export function InternalLink({
  href,
  shallow,
  children,
  prefetch,
  replace,
  scroll,
  linkAs,
  ...rest
}: InternalLinkProps): JSX.Element {
  const linkProps: NextLinkProps = {
    as: linkAs,
    href,
    prefetch,
    replace,
    scroll,
    shallow,
  };

  return (
    <NextLink {...linkProps} passHref>
      <ChakraLink {...rest}>{children}</ChakraLink>
    </NextLink>
  );
}
