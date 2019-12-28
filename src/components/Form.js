import React from 'react';

/**
 *
 * @returns {React.FC<{
 * onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
 * spellCheck: boolean,
 * autoCorrect: 'on' | 'off',
 * children: React.ReactChildren
 * }>} Form
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
