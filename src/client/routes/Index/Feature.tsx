import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/core';
import { ReactNode } from 'react';

import { WithChildren } from '../../../../karma/client/Karma';
import { ExternalLink } from '../../components/ExternalLink';

export interface FeatureProps extends WithChildren {
  title: string;
  icon: ReactNode;
  href?: string;
}

export function Feature({
  title,
  href,
  children,
  icon,
}: FeatureProps): JSX.Element {
  const bg = useColorModeValue('gray.100', 'gray.700');

  const heading = (
    <Heading as="h2" size="md" fontWeight="semibold" mt="1em" mb="0.5em">
      {title}
    </Heading>
  );

  return (
    <Box _hover={{ bg }} p="4" borderRadius="5px" as="section">
      {icon}
      {href ? (
        <ExternalLink omitIcon href={href}>
          {heading}
        </ExternalLink>
      ) : (
        heading
      )}
      <Text>{children}</Text>
    </Box>
  );
}
