import { Box, Heading, Text, Image, useColorModeValue } from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { ExternalLink } from '../../components/common/ExternalLink';

export type FeatureProps = {
  title: string;
  children: ReactNode;
  icon?: string | (() => JSX.Element);
  href?: string;
};

const getIcon = (icon: FeatureProps['icon'], title: FeatureProps['title']) => {
  if (typeof icon === 'function') {
    const Icon = icon;
    return <Icon />;
  }

  return <Image src={icon} height="3rem" width="3rem" alt={`${title} Logo`} />;
};

export function Feature({ title, href, children, icon }: FeatureProps) {
  const bg = useColorModeValue('gray.100', 'gray.700');

  const heading = (
    <Heading as="h2" size="md" fontWeight="semibold" mt="1em" mb="0.5em">
      {title}
    </Heading>
  );

  return (
    <Box _hover={{ bg }} p="4" borderRadius="5px">
      {href ? (
        <ExternalLink omitIcon href={href}>
          {icon && getIcon(icon, title)}
          {heading}
        </ExternalLink>
      ) : (
        <>
          <Box height="3rem" width="3rem" />
          {heading}
        </>
      )}
      <Text>{children}</Text>
    </Box>
  );
}
