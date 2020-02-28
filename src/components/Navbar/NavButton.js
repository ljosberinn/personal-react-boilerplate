import { Button } from 'rbx';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { withSuspense } from '../../hocs';

/**
 *
 * @param {{
 * children: JSX.Element
 * }}
 */
export default withSuspense(function NavButton({ children, ...rest }) {
  return (
    <Button as={NavLink} {...rest}>
      {children}
    </Button>
  );
});
