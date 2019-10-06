import React from 'react';
import { sanitizeClassArray } from '../utils';

function Radio({ className, ...rest }) {
  return (
    <input
      type="radio"
      className={sanitizeClassArray([
        'is-checkradio',
        className ? className : false,
      ])}
      {...rest}
    />
  );
}

export default Radio;
