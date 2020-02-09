import React from 'react';

/**
 *
 * @param {{
 * onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
 * spellCheck: boolean,
 * autoCorrect: 'on' | 'off',
 * children: JSX.Element
 * }} props
 */
export default function Form({
  onSubmit,
  spellCheck = false,
  autoCorrect = 'off',
  children,
}) {
  return (
    <form onSubmit={onSubmit} autoCorrect={autoCorrect} spellCheck={spellCheck}>
      {children}
    </form>
  );
}
