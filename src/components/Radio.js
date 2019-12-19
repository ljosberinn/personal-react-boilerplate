import React from 'react';
import classnames from 'classnames';

/**
 *
 * @returns {React.FC<{
 * className?: string
 * }>} Radio
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
