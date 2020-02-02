import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon as RBXIcon } from 'rbx';
import React from 'react';

/**
 *
 * @param {{
 * icon: import('@fortawesome/free-solid-svg-icons').IconDefinition
 * }}
 */
export default function Icon({ icon, ...rest }) {
  return (
    <RBXIcon {...rest}>
      <FontAwesomeIcon icon={icon} />
    </RBXIcon>
  );
}
