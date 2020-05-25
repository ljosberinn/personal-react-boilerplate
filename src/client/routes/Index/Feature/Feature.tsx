import { Box } from '@chakra-ui/core';
import * as React from 'react';

import FeatureIcon from './FeatureIcon';
import { FeatureState } from './types';

type FeatureProps = React.PropsWithChildren<{
  state: FeatureState;
  info?: string;
  id?: string;
}>;

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
