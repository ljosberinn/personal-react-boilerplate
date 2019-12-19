import React from 'react';
import classnames from 'classnames';

/**
 *
 * @see https://buefy.org/documentation/switch
 *
 * @returns {React.FC<{
 * size: import('rbx/elements/form/input').InputVariablesDefaults['sizes'][number],
 * color: import('rbx/base/helpers/variables').VariablesDefaults['colors'][number],
 * name: string,
 * disabled: boolean,
 * rounded: boolean,
 * outlined: boolean,
 * text: string|number,
 * value: string | number | boolean,
 * onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 * checked?: boolean
 * }>} Switch
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
  ...rest
}) {
  const labelClasses = classnames([
    'switch',
    rounded && 'is-rounded',
    disabled && 'is-disabled',
    size && `is-${size}`,
    outlined && `is-outlined`,
  ]);

  const spanClasses = classnames(['check', color && `is-${color}`]);

  return (
    <label className={labelClasses}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        name={name}
        onChange={onChange}
        {...rest}
      />
      <span className={spanClasses} />
      <span className="control-label">{text}</span>
    </label>
  );
}
