import { Link as ChakraLink } from '@chakra-ui/react';
import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import type { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';

import type { WithChildren } from '../karma/types';

export type InternalLinkProps =
  // enforce having children
  WithChildren<{
    omitTextDecoration?: boolean;
  }> &
    // `href` is included in `NextLinkProps`, `children` are taken care of
    Omit<ChakraLinkProps, 'href' | 'children'> &
    // - `passHref` is internally taken care of
    // - `as` is outdated since 9.5.3
    Omit<NextLinkProps, 'passHref' | 'as'>;

function useLinkAria({
  href,
  locale: targetLocale,
}: Pick<NextLinkProps, 'href' | 'locale'>): 'page' | undefined {
  const { pathname, locale: currentLocale } = useRouter();
  const isCurrentLocale = currentLocale === targetLocale;

  if (typeof href === 'string') {
    return isCurrentLocale && pathname === href ? 'page' : undefined;
  }

  return isCurrentLocale && pathname === href.pathname ? 'page' : undefined;
}

export const InternalLink = forwardRef<HTMLAnchorElement, InternalLinkProps>(
  (
    {
      href,
      shallow,
      children,
      prefetch,
      replace,
      scroll,
      locale,
      omitTextDecoration,
      ...rest
    },
    ref
  ) => {
    const ariaCurrent = useLinkAria({ href, locale });

    const chakraLinkProps: ChakraLinkProps = {
      ...rest,
      ...(omitTextDecoration ? { _hover: { textDecoration: 'none' } } : null),
      'aria-current': ariaCurrent,
    };

    const linkProps: NextLinkProps = {
      href,
      locale,
      prefetch,
      replace,
      scroll,
      shallow,
    };

    return (
      <NextLink {...linkProps} passHref>
        <ChakraLink {...chakraLinkProps} ref={ref}>
          {children}
        </ChakraLink>
      </NextLink>
    );
  }
);
