import React from 'react';
import { Field as RBXField } from 'rbx';
import classnames from 'classnames';

/**
 *
 * @returns {React.FC<{
 *  children: React.ReactChildren,
 * className?: string,
 * isFloatingLabel?: boolean
 * }>} Field
 */
export default function Field({
  children,
  isFloatingLabel,
  className,
  ...rest
}) {
  return (
    <RBXField
      className={classnames([
        className,
        isFloatingLabel && 'is-floating-label',
      ])}
      {...rest}
    >
      {children}
    </RBXField>
  );
}
