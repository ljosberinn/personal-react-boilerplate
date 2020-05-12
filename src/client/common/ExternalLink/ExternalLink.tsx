import { Link, Icon } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  href: string;
  rel?: string;
  target?: string;
  withIcon?: boolean;
}>;

export default function ExternalLink({
  children,
  withIcon = true,
  ...rest
}: Props) {
  return (
    <Link isExternal rel="noreferrer noopener" color="teal.500" {...rest}>
      {children} {withIcon && <Icon name="external-link" ml={1} />}
    </Link>
  );
}
