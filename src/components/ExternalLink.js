import React from 'react';

export default function ExternalLink({ href, children, ...rest }) {
  return (
    <a href={href} rel="noreferrer noopener" target="_blank" {...rest}>
      {children}
    </a>
  );
}
