import { Spinner as ChakraSpinner, Box } from '@chakra-ui/core';
import React from 'react';
import { useTimeout } from 'react-use';

interface Props {
  /**
   * timeout in ms after which the spinner will show
   */
  timeout?: number;
  /**
   * if true, covers the full page
   */
  fullWidth?: boolean;
}

export default function Spinner({ timeout = 0, fullWidth }: Props) {
  const [isReady] = useTimeout(timeout);

  if (!isReady()) {
    return null;
  }

  if (fullWidth) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100vw"
        height="100vh"
        position="absolute"
        top={0}
        left={0}
        cursor="progress"
      >
        <ChakraSpinner
          thickness="4px"
          speed="0.65s"
          emptyColor="blue.500"
          size="xl"
        />
      </Box>
    );
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
