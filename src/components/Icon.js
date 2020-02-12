import { Icon as RBXIcon } from 'rbx';
import React from 'react';

/**
 *
 * @param {{
 * svg: import('react-icons').IconType
 * }}
 */
export default function Icon({ svg: Svg, ...rest }) {
  return (
    <RBXIcon {...rest}>
      <Svg
        focusable={false}
        aria-hidden={true}
        strokeWidth={undefined}
        stroke={undefined}
      />
    </RBXIcon>
  );
}
