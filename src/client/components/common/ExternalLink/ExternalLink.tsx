import { Link, Icon, LinkProps } from '@chakra-ui/core';
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
  return (
    <Link isExternal rel="noreferrer noopener" color="teal.500" {...rest}>
      {children} {withIcon && <Icon name="external-link" ml={1} />}
    </Link>
  );
}
