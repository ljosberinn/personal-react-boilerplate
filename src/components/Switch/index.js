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
 * disabled: boolean,
 * rounded: boolean,
 * outlined: boolean,
 * text: string|number,
 * onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 * }}
 */
export default function Switch({
  color,
  disabled,
  size,
  rounded,
  outlined,
  text,
  onChange,
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
      data-testid="switch-label"
    >
      <input
        type="checkbox"
        onChange={onChange}
        disabled={disabled}
        data-testid="switch-checkbox"
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
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  outlined: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};
