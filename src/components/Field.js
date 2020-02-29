import classnames from 'classnames';
import { Field as RBXField } from 'rbx';
import React from 'react';

/**
 *
 * @param {{
 * children: JSX.Element;
 * className?:string;
 * hasFloatingLabel?: boolean;
 * }} props
 */
export default function Field({
  children,
  hasFloatingLabel,
  className,
  ...rest
}) {
  return (
    <RBXField
      className={classnames(className, hasFloatingLabel && 'is-floating-label')}
      {...rest}
    >
      {children}
    </RBXField>
  );
}
