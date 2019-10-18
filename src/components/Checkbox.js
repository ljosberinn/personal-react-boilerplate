import React from 'react';
import { sanitizeClassArray } from '../utils';

function Checkbox({ className, size, circled, blocked, borderless, ...rest }) {
  return (
    <input
      type="checkbox"
      className={sanitizeClassArray([
        'is-checkradio',
        size && `is-${size}`,
        circled && 'is-circle',
        blocked && 'is-blocked',
        borderless && 'has-no-border',
        className,
      ])}
      {...rest}
    />
  );
}

export default Checkbox;
