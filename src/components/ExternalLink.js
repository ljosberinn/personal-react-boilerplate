import React from 'react';

/**
 *
 * @returns {React.FC<{
 * href: string,
 * children: React.ReactChildren
 * }>} ExternalLink
 */
export default function ExternalLink({ href, children, ...rest }) {
  return (
    <a href={href} rel="noreferrer noopener" target="_blank" {...rest}>
      {children}
    </a>
  );
}
