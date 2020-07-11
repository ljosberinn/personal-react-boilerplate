import { Box, Heading, Text, Image, BoxProps } from '@chakra-ui/core';
import React, { ReactNode } from 'react';

// type WithIcon = { icon: () => JSX.Element; img: never };
// type WithImage = { icon: never; img: string };
export type FeatureProps = BoxProps & {
  title: string;
  children: ReactNode;
  icon?: () => JSX.Element;
  img?: string;
};
export function Feature({
  title,
  icon: Icon,
  img,
  children,
  ...props
}: FeatureProps) {
  return (
    <Box {...props}>
      {Icon ? (
        <Icon />
      ) : (
        <Image src={img} height="3rem" width="3rem" alt={title} />
      )}

      <Heading as="h2" size="md" fontWeight="semibold" mt="1em" mb="0.5em">
        {title}
      </Heading>
      <Text>{children}</Text>
    </Box>
  );
}
