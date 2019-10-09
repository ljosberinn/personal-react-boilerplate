import React from 'react';
import { Icon as RBXIcon } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 *
 * @param { { icon: IconDefinition } } props
 */
function Icon({ icon, ...rest }) {
  return (
    <RBXIcon {...rest}>
      <FontAwesomeIcon icon={icon} />
    </RBXIcon>
  );
}

export default Icon;
