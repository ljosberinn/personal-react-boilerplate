import React from 'react';
import { Icon } from './';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { validate } from '../utils/validators';

const ValidityIconRight = ({ type, value = '' }) => {
  if (value.length === 0) {
    return null;
  }

  let color = 'danger';
  let icon = faTimes;

  switch (type) {
    case 'password':
      if (validate.password(value)) {
        color = 'success';
        icon = faCheck;
      }
      break;
    case 'mail':
      if (validate.mail(value)) {
        color = 'success';
        icon = faCheck;
      }
      break;
    case 'username':
      if (validate.username(value)) {
        color = 'success';
        icon = faCheck;
      }
      break;
    case 'realName':
      if (validate.realName(value)) {
        color = 'success';
        icon = faCheck;
      }
      break;
    default:
      console.warn(
        `Undefined ValidityIconRight case ${type} with value ${value}`,
      );
  }

  return <Icon align="right" color={color} icon={icon} />;
};

export default ValidityIconRight;
