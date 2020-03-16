import PropTypes from 'prop-types';
import { Button } from 'rbx';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { withSuspense } from '../../hocs';

/**
 *
 * @param {{
 * children: JSX.Element;
 * to: string;
 * }}
 */
function NavButton({ children, ...rest }) {
  return (
    <Button as={NavLink} {...rest}>
      {children}
    </Button>
  );
}

NavButton.propTypes = {
  to: PropTypes.string.isRequired,
};

export default withSuspense(NavButton);
