import React from 'react';
import { Field as RBXField } from 'rbx';
import { sanitizeClassArray } from '../utils';

/**
 *
 * @param {{
 *  children: React.Children,
 *  className: string|undefined,
 *  isFloatingLabel: boolean|undefined
 * }} props
 *
 */
export default function Field({
  children,
  isFloatingLabel,
  className,
  ...rest
}) {
  return (
    <RBXField
      className={sanitizeClassArray([
        className,
        isFloatingLabel && 'is-floating-label',
      ])}
      {...rest}
    >
      {children}
    </RBXField>
  );
}
