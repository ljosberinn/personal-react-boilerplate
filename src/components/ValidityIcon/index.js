import PropTypes from 'prop-types';
import React from 'react';
import { FaLock, FaLockOpen, FaEnvelope } from 'react-icons/fa';

import { validate } from '../../utils/validators';
import Icon from '../Icon';

export const iconMap = {
  password: {
    success: FaLock,
    error: FaLockOpen,
  },
  mail: {
    success: FaEnvelope,
    error: undefined,
  },
};

/**
 *
 * @param {{
 * type: 'password' | 'mail';
 * align: 'left' | 'right';
 * value: string;
 * }}
 */
export default function ValidityIcon({ type, align, value }) {
  const { success, error } = iconMap[type];

  const color =
    value.length > 0
      ? validate[type](value)
        ? 'success'
        : 'danger'
      : undefined;

  if (error) {
    return (
      <Icon
        align={align}
        color={color}
        svg={color === 'success' ? success : error}
      />
    );
  }

  return <Icon align={align} color={color} svg={success} />;
}

ValidityIcon.propTypes = {
  type: PropTypes.oneOf(Object.keys(iconMap)).isRequired,
  value: PropTypes.string.isRequired,
  align: PropTypes.oneOf(['left', 'right']).isRequired,
};
