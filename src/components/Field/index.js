import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Field as RBXField } from 'rbx';
import React from 'react';

/**
 *
 * @param {{
 * children: JSX.Element;
 * className?: string;
 * floating?: boolean;
 * }} props
 */
export default function Field({ children, floating, className, ...rest }) {
  return (
    <RBXField
      data-testid="field"
      className={classnames(className, floating && 'is-floating-label')}
      {...rest}
    >
      {children}
    </RBXField>
  );
}

Field.propTypes = {
  floating: PropTypes.bool,
};
