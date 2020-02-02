import React from 'react';
import classnames from 'classnames';

/**
 * @param {{
 * className?: string,
 * size: string | number,
 * circled: boolean,
 * blocked: boolean,
 * borderless: boolean
 * }} props
 */
export default function Checkbox({
  className,
  size,
  circled,
  blocked,
  borderless,
  ...rest
}) {
  return (
    <input
      type="checkbox"
      className={classnames([
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
