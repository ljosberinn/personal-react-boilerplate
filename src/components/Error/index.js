import { Help } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

/**
 *
 * @param {{
 * children: JSX.Element
 * }} props
 */
export default function Error({ children, ...rest }) {
  return (
    <Fade triggerOnce {...rest}>
      <Help color="danger" role="alert" data-testid="error">
        {children}
      </Help>
    </Fade>
  );
}
