import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 *
 * @see https://buefy.org/documentation/switch
 *
 * @param {{
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
 * }}
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
  return (
    <label
      className={classnames(
        'switch',
        rounded && 'is-rounded',
        disabled && 'is-disabled',
        size && `is-${size}`,
        outlined && `is-outlined`,
      )}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        name={name}
        onChange={onChange}
        {...rest}
      />
      <span className={classnames('check', color && `is-${color}`)} />
      <span className="control-label">{text}</span>
    </label>
  );
}

Switch.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  size: PropTypes.string,
  outlined: PropTypes.bool,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  text: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};
