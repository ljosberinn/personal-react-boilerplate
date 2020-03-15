import classnames from 'classnames';
import React from 'react';

/**
 *
 * @param {{
 * className?: string
 * }}
 */
export default function Radio({ className, ...rest }) {
  return (
    <input
      type="radio"
      data-testid="radio"
      className={classnames('is-checkradio', className)}
      {...rest}
    />
  );
}
