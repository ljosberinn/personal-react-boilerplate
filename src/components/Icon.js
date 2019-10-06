import React from 'react';
import { Icon as RBXIcon } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 *
 * @param {{icon: IconDefinition, onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void}} props
 */
function Icon({ icon, ...rest }) {
  return (
    <RBXIcon {...rest}>
      <FontAwesomeIcon icon={icon} />
    </RBXIcon>
  );
}

export default Icon;
