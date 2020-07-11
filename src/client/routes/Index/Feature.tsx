import { Box, Heading, Text, Image } from '@chakra-ui/core';
import { title } from 'process';
import React, { ReactNode } from 'react';

import { ExternalLink } from '../../components/common/ExternalLink';

export type FeatureProps = {
  title: string;
  children: ReactNode;
  icon: string | (() => JSX.Element);
  href: string;
};

const getIcon = (icon: FeatureProps['icon']) => {
  if (typeof icon === 'function') {
    const Icon = icon;
    return <Icon />;
  }

  return <Image src={icon} height="3rem" width="3rem" alt={title} />;
};

export function Feature({ title, href, children, icon }: FeatureProps) {
  return (
    <Box>
      {getIcon(icon)}
      <Heading as="h2" size="md" fontWeight="semibold" mt="1em" mb="0.5em">
        <ExternalLink omitIcon href={href}>
          {title}
        </ExternalLink>
      </Heading>
      <Text>{children}</Text>
    </Box>
  );
}
