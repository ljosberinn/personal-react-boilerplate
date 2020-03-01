import PropTypes from 'prop-types';
import React from 'react';
import { FaLock, FaLockOpen, FaIdCard, FaEnvelope } from 'react-icons/fa';

import { validate } from '../utils/validators';
import Icon from './Icon';

const iconMap = {
  password: {
    success: FaLock,
    error: FaLockOpen,
  },
  mail: {
    success: FaEnvelope,
    error: undefined,
  },
  username: {
    success: FaIdCard,
    error: undefined,
  },
};

/**
 *
 * @param {{
 * type: 'password' | 'mail' | 'username',
 * value: string
 * }}
 */
export default function ValidityIconLeft({ type, value = '' }) {
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
        align="left"
        color={color}
        svg={color === 'success' ? success : error}
      />
    );
  }

  return <Icon align="left" color={color} svg={success} />;
}

ValidityIconLeft.propTypes = {
  type: PropTypes.oneOf(['password', 'mail', 'username']).isRequired,
  value: PropTypes.string.isRequired,
};
