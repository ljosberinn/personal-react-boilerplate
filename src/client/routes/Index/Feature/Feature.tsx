import { Box } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

import FeatureIcon from './FeatureIcon';
import { FeatureState } from './types';

type FeatureProps = PropsWithChildren<{
  state: FeatureState;
  info?: string;
}>;

export default function Feature({
  children,
  state,
  info,
  ...props
}: FeatureProps) {
  return (
    <Box {...props}>
      <FeatureIcon state={state} /> {children}{' '}
      {info && (
        <small>
          <em>({info})</em>
        </small>
      )}
    </Box>
  );
}
