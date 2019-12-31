import React from 'react';
import { Help } from 'rbx';
import { Fade } from 'react-awesome-reveal';

/**
 *
 * @returns {React.FC<{
 *  children: React.Children
 * }>} Error
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
