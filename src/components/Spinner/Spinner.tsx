import { Spinner as ChakraSpinner } from '@chakra-ui/core';
import React from 'react';
import { useTimeout } from 'react-use';

interface Props {
  timeout?: number;
}

export default function Spinner({ timeout = 0 }: Props) {
  const [isReady] = useTimeout(timeout);

  if (!isReady()) {
    return null;
  }

  return (
    <ChakraSpinner
      thickness="4px"
      speed="0.65s"
      emptyColor="blue.500"
      size="xl"
    />
  );
}
