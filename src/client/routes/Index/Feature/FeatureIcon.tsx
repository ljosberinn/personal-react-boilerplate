import { Tooltip, Icon } from '@chakra-ui/core';
import React from 'react';

import { FeatureState } from './types';

const iconMap = {
  done: { color: 'green.500', icon: 'check-circle', label: 'done' },
  wip: { color: 'orange.500', icon: 'time', label: 'work in progress' },
  nyi: { color: 'red.500', icon: 'warning', label: 'not yet implemented' },
};

interface FeatureIconProps {
  state: FeatureState;
}

export default function FeatureIcon({ state }: FeatureIconProps) {
  const { icon, color, label } = iconMap[state];

  return (
    <Tooltip hasArrow aria-label={label} label={label}>
      <Icon name={icon} color={color} />
    </Tooltip>
  );
}
