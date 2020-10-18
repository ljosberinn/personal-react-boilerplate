import { ChakraProvider } from '@chakra-ui/core';
import { I18nextProvider } from 'react-i18next';

import { MetaThemeColorSynchronizer } from '../components/MetaThemeColorSynchronizer';
import { ServiceWorker } from '../components/ServiceWorker';
import { AuthContextProvider } from '../context/AuthContext';
import { initI18Next } from './i18n';
import type { KarmaCoreProps, WithChildren } from './types';

export function KarmaCore({
  i18n,
  colorModeManager,
  auth,
  mode,
  chakra,
  children,
}: WithChildren<KarmaCoreProps>): JSX.Element {
  const i18nInstance = initI18Next(i18n);

  return (
    <AuthContextProvider {...auth} mode={mode}>
      <I18nextProvider i18n={i18nInstance}>
        <ChakraProvider {...chakra} colorModeManager={colorModeManager}>
          <ServiceWorker />
          <MetaThemeColorSynchronizer />
          {/* <CustomPWAInstallPrompt /> */}
          {children}
        </ChakraProvider>
      </I18nextProvider>
    </AuthContextProvider>
  );
}
