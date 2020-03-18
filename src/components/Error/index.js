import PropTypes from 'prop-types';
import { Help } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

/**
 *
 * @param {{
 * children: JSX.Element
 * }} props
 */
export default function Error({
  children,
  'data-testid': dataTestId = 'error',
  ...rest
}) {
  return (
    <Fade triggerOnce {...rest}>
      <Help color="danger" role="alert" data-testid={dataTestId}>
        {children}
      </Help>
    </Fade>
  );
}

Error.propTypes = {
  children: PropTypes.node.isRequired,
  'data-testid': PropTypes.string,
};
