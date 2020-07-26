import { Link, LinkProps, useColorModeValue } from '@chakra-ui/core';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import React, { ReactNode, forwardRef, Ref } from 'react';

export type ExternalLinkProps = LinkProps & {
  href: string;
  rel?: string;
  target?: string;
  omitIcon?: boolean;
  omitTextDecoration?: boolean;
  children: ReactNode;
};

export const ExternalLink = forwardRef(
  (
    { children, omitIcon, omitTextDecoration, ...rest }: ExternalLinkProps,
    ref: Ref<HTMLAnchorElement>
  ) => {
    const color = useColorModeValue('teal.700', 'teal.400');

    return (
      <Link
        isExternal
        color={color}
        {...rest}
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
