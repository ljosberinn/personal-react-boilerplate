import { Link, useColorModeValue, Icon } from '@chakra-ui/react';
import type { LinkProps } from '@chakra-ui/react';
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
      color: 'teal.500',
      ...rest._hover,
      textDecoration: omitTextDecoration ? 'none' : 'underline',
    };

    return (
      <Link
        color={color}
        {...rest}
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
