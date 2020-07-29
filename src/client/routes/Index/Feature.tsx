import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { ExternalLink } from '../../components/common/ExternalLink';
import { MFC } from '../../types';

export type FeatureProps = {
  title: string;
  children: ReactNode;
  icon: ReactNode;
  href?: string;
};

export const Feature: MFC<FeatureProps> = ({ title, href, children, icon }) => {
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
          {icon}
          {heading}
        </ExternalLink>
      ) : (
        <>
          {icon}
          {heading}
        </>
      )}
      <Text>{children}</Text>
    </Box>
  );
};
