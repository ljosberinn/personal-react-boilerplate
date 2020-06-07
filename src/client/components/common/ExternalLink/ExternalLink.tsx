import { Link, Icon, LinkProps, useColorMode } from '@chakra-ui/core';
import React, { ReactNode } from 'react';

export interface ExternalLinkProps extends LinkProps {
  href: string;
  rel?: string;
  target?: string;
  withIcon?: boolean;
  children: ReactNode;
}

export default function ExternalLink({
  children,
  withIcon = true,
  ...rest
}: ExternalLinkProps) {
  const { colorMode } = useColorMode();

  return (
    <Link
      isExternal
      rel="noreferrer noopener"
      color={colorMode === 'dark' ? 'teal.400' : 'teal.700'}
      {...rest}
    >
      {children} {withIcon && <Icon name="external-link" ml={1} />}
    </Link>
  );
}
