import React from 'react';
import { sanitizeClassArray } from '../utils';

/**
 * @see https://buefy.org/documentation/switch
 *
 * @param {{
 *  color: (typeof rbx/base/helpers/variables/DEFAULTS.colors)[number],
 *  size: (typeof rbx/elements/form/input/INPUT_DEFAULTS.sizes)[number],
 *  name: string,
 *  disabled: boolean,
 *  rounded: boolean,
 *  outlined: boolean,
 *  text: string|number,
 *  value: string|number|boolean,
 *  onChange: (e: React.ChangeEvent<HTMLInputElement />) => void
 *  checked?: boolean
 * }} Props
 *
 * @returns React.FC<Props>
 */
export default function Switch({
  color,
  disabled,
  name,
  size,
  rounded,
  outlined,
  value,
  text,
  onChange,
  checked,
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
      <input
        type="checkbox"
        value={value}
        checked={checked}
        name={name}
        onChange={onChange}
      />
      <span className={spanClasses} />
      <span className="control-label">{text}</span>
    </label>
  );
}
