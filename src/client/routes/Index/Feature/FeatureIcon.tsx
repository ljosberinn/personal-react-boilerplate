import { Tooltip } from '@chakra-ui/core';
import {
  WarningIcon,
  TimeIcon,
  QuestionIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';
import React from 'react';

import { FeatureState } from './types';

const iconMap = {
  done: { color: 'green.500', icon: CheckCircleIcon, label: 'done' },
  nyi: { color: 'red.500', icon: WarningIcon, label: 'not yet implemented' },
  opt: {
    color: 'yellow.500',
    icon: QuestionIcon,
    label: 'optionally available',
  },
  wip: { color: 'orange.500', icon: TimeIcon, label: 'work in progress' },
};

interface FeatureIconProps {
  state: FeatureState;
}

export default function FeatureIcon({ state }: FeatureIconProps) {
  const { icon: Icon, color, label } = iconMap[state];

  return (
    <Tooltip hasArrow aria-label={label} label={label} sx={undefined}>
      <Icon color={color} sx={undefined} />
    </Tooltip>
  );
}
