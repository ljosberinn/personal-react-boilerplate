import React from 'react';
import { Icon } from './';
import {
  faLock,
  faLockOpen,
  faIdCard,
  faEnvelope,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { validate } from '../utils/validators';

function ValidityIconLeft({ type, value = '' }) {
  let color = undefined;
  let requiresSuccessColor = true;
  let successIcon;
  let errorIcon;

  switch (type) {
    case 'password':
      color =
        value.length > 0
          ? validate.password(value)
            ? 'success'
            : 'danger'
          : undefined;

      successIcon = faLock;
      errorIcon = faLockOpen;
      break;
    case 'mail':
      color =
        value.length > 0
          ? validate.mail(value)
            ? 'success'
            : 'danger'
          : undefined;

      successIcon = faEnvelope;
      requiresSuccessColor = false;
      break;
    case 'username':
      color =
        value.length > 0
          ? validate.username(value)
            ? 'success'
            : 'danger'
          : undefined;

      requiresSuccessColor = false;
      successIcon = faIdCard;
      break;
    case 'firstLastName':
      color =
        value.length > 0
          ? validate.realName(value)
            ? 'success'
            : 'danger'
          : undefined;
      successIcon = faUserAlt;
      requiresSuccessColor = false;
      break;
    default:
      return null;
  }

  const icon = requiresSuccessColor
    ? color === 'success'
      ? successIcon
      : errorIcon
    : successIcon;

  return <Icon align="left" color={color} icon={icon} />;
}

export default ValidityIconLeft;
