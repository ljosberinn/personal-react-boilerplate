import { Link, LinkProps, useColorModeValue } from '@chakra-ui/core';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import React, { ReactNode, forwardRef, Ref } from 'react';

export type ExternalLinkProps = LinkProps & {
  href: string;
  rel?: string;
  target?: string;
  withIcon?: boolean;
  children: ReactNode;
};

function ExternalLink(
  { children, withIcon = true, ...rest }: ExternalLinkProps,
  ref: Ref<HTMLAnchorElement>
) {
  const color = useColorModeValue('teal.700', 'teal.400');

  return (
    <Link isExternal color={color} {...rest} ref={ref}>
      {children} {withIcon && <ExternalLinkIcon ml={1} />}
    </Link>
  );
}

export default forwardRef(ExternalLink);
