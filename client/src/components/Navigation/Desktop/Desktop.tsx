import * as React from 'react';

import { useAuth0 } from '../../../hooks/useAuth0';
import { LanguageSwitch } from '../../LanguageSwitch';
import { ThemeSwitch } from '../../ThemeSwitch';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

export default function Desktop() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <ThemeSwitch />
      <LanguageSwitch ml={2} mr={2} />
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </>
  );
}
