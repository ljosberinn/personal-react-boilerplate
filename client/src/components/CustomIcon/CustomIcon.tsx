import { Box, IconProps } from '@chakra-ui/core';
import React from 'react';
import { IconType } from 'react-icons';

interface Props extends IconProps {
  icon: IconType;
}

export default function CustomIcon({
  icon,
  display = 'inline-block',
  role = 'presentation',
  focusable = false,
  ...rest
}: Props) {
  return (
    <Box
      verticalAlign="unset"
      as={icon}
      display={display}
      role={role}
      {...{ focusable }}
      {...rest}
    />
  );
}
