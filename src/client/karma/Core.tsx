import { ChakraProvider } from '@chakra-ui/react';

import { MetaThemeColorSynchronizer } from '../components/MetaThemeColorSynchronizer';
import { ServiceWorker } from '../components/ServiceWorker';
import { AuthContextProvider } from '../context/AuthContext';
import { I18NContextProvider } from '../context/I18NContext';
import type { KarmaCoreProps, WithChildren } from './types';

export function KarmaCore({
  i18n,
  colorModeManager,
  auth,
  mode,
  chakra,
  children,
}: WithChildren<KarmaCoreProps>): JSX.Element {
  return (
    <AuthContextProvider {...auth} mode={mode}>
      <I18NContextProvider {...i18n}>
        <ChakraProvider {...chakra} colorModeManager={colorModeManager}>
          <ServiceWorker />
          <MetaThemeColorSynchronizer />
          {/* <CustomPWAInstallPrompt /> */}
          {children}
        </ChakraProvider>
      </I18NContextProvider>
    </AuthContextProvider>
  );
}
