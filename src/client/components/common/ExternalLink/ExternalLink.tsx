import { Link, Icon, LinkProps } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

type ExternalLinkProps = PropsWithChildren<
  {
    href: string;
    rel?: string;
    target?: string;
    withIcon?: boolean;
  } & LinkProps
>;

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
