import React from 'react';
import { sanitizeClassArray } from '../utils';
// eslint-disable-next-line
import { DEFAULTS } from 'rbx/base/helpers/variables';
// eslint-disable-next-line
import { INPUT_DEFAULTS } from 'rbx/elements/form/input';

/**
 * @see https://buefy.org/documentation/switch
 *
 * @param {{
 *  color: (typeof DEFAULTS.colors)[number],
 *  size: (typeof INPUT_DEFAULTS.sizes)[number],
 *  name: string,
 *  disabled: boolean,
 *  rounded: boolean,
 *  outlined: boolean,
 *  text: string|number,
 *  value: string|number|boolean,
 *  onChange: (e: React.ChangeEvent<HTMLInputElement />) => void
 * }} props
 */
function Switch({
  color,
  disabled,
  name,
  size,
  rounded,
  outlined,
  value,
  text,
  onChange,
}) {
  const labelClasses = sanitizeClassArray([
    'switch',
    rounded && 'is-rounded',
    disabled && 'is-disabled',
    size && `is-${size}`,
    outlined && `is-outlined`,
  ]);

  const spanClasses = sanitizeClassArray(['check', color && `is-${color}`]);

  return (
    <label className={labelClasses}>
      <input type="checkbox" value={value} name={name} onChange={onChange} />
      <span className={spanClasses} />
      <span className="control-label">{text}</span>
    </label>
  );
}

export default Switch;
