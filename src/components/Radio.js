import React from 'react';
import { sanitizeClassArray } from '../utils';
export default function Radio({ className, ...rest }) {
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
