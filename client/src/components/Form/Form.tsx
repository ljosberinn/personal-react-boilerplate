import * as React from 'react';

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  spellCheck?: boolean;
  autoCorrect?: 'on' | 'off';
  children: JSX.Element;
}

export default function Form({
  onSubmit,
  spellCheck = false,
  autoCorrect = 'off',
  children,
}: Props) {
  return (
    <form onSubmit={onSubmit} autoCorrect={autoCorrect} spellCheck={spellCheck}>
      {children}
    </form>
  );
}
