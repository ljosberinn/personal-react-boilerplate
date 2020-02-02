import { Help } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

/**
 *
 * @param {{
 * children: React.Children
 * }} props
 */
export default function Error({ children, ...rest }) {
  return (
    <Fade triggerOnce {...rest}>
      <Help color="danger" role="alert">
        {children}
      </Help>
    </Fade>
  );
}
