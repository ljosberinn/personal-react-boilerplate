import { useColorModeValue, Icon } from '@chakra-ui/core';
import React from 'react';

import { MFC } from '../../../types';

export const PWAIcon: MFC<{ size: string }> = ({ size }) => {
  const fill = useColorModeValue('#3D3D3D', 'white');

  return (
    <Icon viewBox="0 0 1952 734.93" width={size} height={size}>
      <title>PWA Logo</title>
      <path
        fill={fill}
        d="M1436.62 603.3l56.39-142.6h162.82l-77.27-216.31L1675.2 0 1952 734.93h-204.13l-47.3-131.63h-263.95z"
      />
      <path
        fill="#5A0FC8"
        d="M1262.47 734.93L1558.79 0h-196.45l-202.7 474.93L1015.5 0h-151L709.73 474.93 600.6 258.52l-98.78 304.3L602.1 734.93h193.33l139.85-425.9 133.35 425.9h193.84z"
      />
      <path
        fill={fill}
        d="M186.48 482.64h121c36.65 0 69.3-4.09 97.92-12.27l31.29-96.4 87.46-269.45a215.3 215.3 0 00-22.83-29.96C456.42 24.86 390.72 0 304.22 0H0v734.93h186.48V482.64zm160.16-313.56c17.54 17.65 26.31 41.27 26.31 70.87 0 29.82-7.71 53.47-23.14 70.96-16.9 19.42-48.04 29.13-93.4 29.13h-69.93V142.6h70.44c42.27 0 72.18 8.83 89.72 26.48z"
      />
    </Icon>
  );
};
