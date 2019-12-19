import React from 'react';
import Icon from './Icon';
import {
  faLock,
  faLockOpen,
  faIdCard,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { validate } from '../utils/validators';

const iconMap = {
  password: {
    success: faLock,
    error: faLockOpen,
  },
  mail: {
    success: faEnvelope,
    error: undefined,
  },
  username: {
    success: faIdCard,
    error: undefined,
  },
};

/**
 *
 * @returns {React.FC<{
 * type: 'password' | 'mail' | 'username',
 * value: string
 * }>} ValidityIconLeft
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
        icon={color === 'success' ? success : error}
      />
    );
  }

  return <Icon align="left" color={color} icon={success} />;
}
