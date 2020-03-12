import PropTypes from 'prop-types';
import { Menu } from 'rbx';
import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../Icon';

/**
 *
 * @param {string} path
 */
const matchPath = path =>
  window.location.pathname.includes(path.substr(1).split('/')[0]);

/**
 *
 * @param {{
 * to: string;
 * svg: import('react-icons').IconType;
 * children: JSX.Element;
 * isExpanded: boolean;
 * onClick?: () => void;
 * }}
 */
export default function NavigationLink({
  to,
  svg,
  children,
  isExpanded,
  onClick,
}) {
  return (
    <Menu.List.Item
      as={Link}
      to={to}
      active={matchPath(to)}
      tooltip={isExpanded ? undefined : children}
      tooltipPosition={isExpanded ? undefined : 'right'}
      onClick={onClick}
    >
      <Icon svg={svg} />
      <span>{children}</span>
    </Menu.List.Item>
  );
}

NavigationLink.propTypes = {
  to: PropTypes.string.isRequired,
  svg: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
