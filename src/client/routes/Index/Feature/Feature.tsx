import { Box } from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import FeatureIcon from './FeatureIcon';
import { FeatureState } from './types';

interface FeatureProps {
  state: FeatureState;
  info?: string;
  id?: string;
  children: ReactNode;
}

export default function Feature({
  children,
  state,
  info,
  id,
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
      {id && (
        <sup>
          <a href={`#${id}`}>more info</a>
        </sup>
      )}
    </Box>
  );
}
