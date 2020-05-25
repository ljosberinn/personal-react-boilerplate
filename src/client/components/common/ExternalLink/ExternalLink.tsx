import { Link, Icon, LinkProps } from '@chakra-ui/core';
import * as React from 'react';

type ExternalLinkProps = React.PropsWithChildren<
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
