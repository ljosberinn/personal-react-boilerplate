import { Menu } from 'rbx';
import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../Icon';

/**
 *
 * @param {string} path
 */
const matchPath = path =>
  window.location.pathname.includes(path.substr(1).split('/')[0]);

/**
 *
 * @param {{
 * path: string;
 * icon: import('@fortawesome/free-brands-svg-icons').IconDefinition;
 * children: JSX.Element;
 * isExpanded: boolean;
 * onClick?: () => void;
 * }}
 */
export default function NavigationLink({
  path,
  icon,
  children,
  isExpanded,
  onClick,
}) {
  return (
    <Menu.List.Item
      as={Link}
      to={path}
      active={matchPath(path)}
      tooltip={isExpanded ? undefined : children}
      tooltipPosition="right"
      onClick={onClick}
    >
      <Icon svg={icon} />
      <span>{children}</span>
    </Menu.List.Item>
  );
}
