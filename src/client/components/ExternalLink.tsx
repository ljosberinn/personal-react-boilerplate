import type { LinkProps } from '@chakra-ui/core';
import { Link, useColorModeValue, Icon } from '@chakra-ui/core';
import { forwardRef } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import type { WithChildren } from '../karma/types';

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

    const _hover = {
      ...rest._hover,
      color: 'teal.500',
      textDecoration: omitTextDecoration ? 'none' : 'underline',
    };

    return (
      <Link
        {...rest}
        color={color}
        isExternal
        ref={ref}
        whiteSpace="nowrap"
        _hover={_hover}
      >
        {children}
        {!omitIcon && <Icon as={FaExternalLinkAlt} ml={1} w={3} />}
      </Link>
    );
  }
);
