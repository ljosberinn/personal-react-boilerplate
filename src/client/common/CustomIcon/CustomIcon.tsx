import { Box, IconProps as ChakraIconProps } from '@chakra-ui/core';
import React from 'react';
import { IconType } from 'react-icons';

interface IconProps extends ChakraIconProps {
  icon: IconType;
}

export default function CustomIcon({
  icon,
  display = 'inline-block',
  role = 'presentation',
  focusable = false,
  ...rest
}: IconProps) {
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
