import { Text } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{}>;

export default function Heading({ children }: Props) {
  return (
    <Text fontWeight="bold" pb={5}>
      {children}
    </Text>
  );
}
