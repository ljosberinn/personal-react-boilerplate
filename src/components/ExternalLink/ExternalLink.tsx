import { Link, Icon } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ href: string; rel?: string; target?: string }>;

export default function ExternalLink({ children, ...rest }: Props) {
  return (
    <Link isExternal rel="noreferrer noopener" color="teal.500" {...rest}>
      {children} <Icon name="external-link" ml={1} />
    </Link>
  );
}
