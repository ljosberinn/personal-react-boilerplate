import { Link, LinkProps, useColorModeValue } from '@chakra-ui/core';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { forwardRef } from 'react';

import { WithChildren } from '../Karma';

export type ExternalLinkProps = LinkProps &
  WithChildren & {
    href: string;
    rel?: string;
    target?: string;
    omitIcon?: boolean;
    omitTextDecoration?: boolean;
  };

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ children, omitIcon, omitTextDecoration, ...rest }, ref) => {
    const color = useColorModeValue('teal.700', 'teal.400');

    return (
      <Link
        {...rest}
        color={color}
        isExternal
        ref={ref}
        whiteSpace="nowrap"
        _hover={omitTextDecoration ? { textDecoration: 'none' } : undefined}
      >
        {children}
        {!omitIcon && <ExternalLinkIcon ml={1} />}
      </Link>
    );
  }
);
