import React from 'react';
import { sanitizeClassArray } from '../utils';

function Checkbox({ className, ...rest }) {
  return (
    <input
      type="checkbox"
      className={sanitizeClassArray(['is-checkradio', className])}
      {...rest}
    />
  );
}

export default Checkbox;
