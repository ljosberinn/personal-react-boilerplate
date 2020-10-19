import type { LinkProps as ChakraLinkProps } from '@chakra-ui/core';
import { Link as ChakraLink } from '@chakra-ui/core';
import type { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';

import { useTranslation } from '../context/I18NContext';
import type { WithChildren } from '../karma/types';

export type InternalLinkProps =
  // enforce having children
  WithChildren<{
    omitTextDecoration?: boolean;
    /**
     * whether the link should automatically prepend the current language
     */
    localized?: boolean;
  }> &
    // `href` is included in `NextLinkProps`, `children` are taken care of
    Omit<ChakraLinkProps, 'href' | 'children'> &
    // - `passHref` is internally taken care of
    // - `as` is outdated since 9.5.3
    Omit<NextLinkProps, 'passHref' | 'as'>;

/**
 * helper function to safely localize `NextLink.href` prop which can be
 * - undefined
 * - a string
 * - an `Url` object containing the new path in `href.pathname`
 */
const localizeHref = (
  href: NextLinkProps['href'],
  language: string
): NextLinkProps['href'] => {
  if (typeof href === 'string') {
    return `/${language}${href}`;
  }

  return {
    ...href,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    pathname: `/${language}${href.pathname}`,
  };
};

function useLinkAria(href: NextLinkProps['href']): 'page' | undefined {
  const { pathname } = useRouter();

  if (typeof href === 'string') {
    return pathname === href ? 'page' : undefined;
  }

  return pathname === href.pathname ? 'page' : undefined;
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
      omitTextDecoration,
      localized = true,
      ...rest
    },
    ref
  ) => {
    const { language } = useTranslation();

    const ariaCurrent = useLinkAria(href);

    const chakraLinkProps: ChakraLinkProps = {
      ...rest,
      _hover: {
        textDecoration: omitTextDecoration ? 'none' : 'initial',
      },
      'aria-current': ariaCurrent,
    };

    const localizedHref = localized ? localizeHref(href, language) : href;

    const linkProps: NextLinkProps = {
      href: localizedHref,
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
