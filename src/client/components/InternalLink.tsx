import type { LinkProps as ChakraLinkProps } from '@chakra-ui/core';
import { Link as ChakraLink } from '@chakra-ui/core';
import type { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME } from '../../constants';
import type { WithChildren } from '../Karma';

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
    // `passHref` must be passed, `as` is proxied to not collide with chakras as
    Omit<NextLinkProps, 'passHref' | 'as'> & {
      linkAs?: NextLinkProps['as'];
    };

/**
 * helper function to safely localize `NextLink.as` prop which can be
 * - undefined
 * - a string
 * - an `Url` object containing the new path in `as.pathname`
 */
const localizeAs = (as: NextLinkProps['as']): NextLinkProps['as'] => {
  if (!as) {
    return as;
  }

  if (typeof as === 'string') {
    return `/[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]${as}`;
  }

  if (!as.pathname) {
    return as;
  }

  return {
    ...as,
    pathname: `/[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]${as.pathname}`,
  };
};

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
  if (!href) {
    return href;
  }

  if (typeof href === 'string') {
    return `/${language}${href}`;
  }

  if (!href.pathname) {
    return href;
  }

  return {
    ...href,
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
      linkAs,
      omitTextDecoration,
      localized = true,
      ...rest
    },
    ref
  ) => {
    const {
      i18n: { language },
    } = useTranslation();

    const ariaCurrent = useLinkAria(href);

    const chakraLinkProps: ChakraLinkProps = {
      ...rest,
      _hover: {
        textDecoration: omitTextDecoration ? 'none' : 'initial',
      },
      'aria-current': ariaCurrent,
    };

    const localizedAs = localized ? localizeAs(linkAs) : linkAs;
    const localizedHref = localized ? localizeHref(href, language) : href;

    const linkProps: NextLinkProps = {
      as: localizedAs,
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
