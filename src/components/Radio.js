import React from 'react';
import classnames from 'classnames';

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
      className={classnames(['is-checkradio', className])}
      {...rest}
    />
  );
}
