import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

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
      data-testid="checkbox"
      className={classnames(
        'is-checkradio',
        size && `is-${size}`,
        circled && 'is-circle',
        blocked && 'is-blocked',
        borderless && 'has-no-border',
        className,
      )}
      {...rest}
    />
  );
}

Checkbox.propTypes = {
  className: PropTypes.string,
  circled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  blocked: PropTypes.bool,
  borderless: PropTypes.bool,
};
