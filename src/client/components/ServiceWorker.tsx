import { Box, useToast, Flex, Text, Icon } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import { IS_PROD, IS_TEST } from '../../../src/constants';
import { useTranslation } from '../hooks/useTranslation';
import type { TFunction } from '../hooks/useTranslation';

const sw = '/service-worker.js';
/**
 * intentionally module-scoped to not warn all the time across hot-reloader
 */
let hasWarned = false;

type RefreshToastProps = {
  t: TFunction;
};

const handleClick = () => {
  window.location.reload();
};

/**
 * Currently mimics toast({status: 'info'}) to allow a global onClick
 */
function RefreshToast({ t }: RefreshToastProps) {
  return (
    <Flex
      backgroundColor="blue.500"
      borderRadius="0.25rem"
      cursor="pointer"
      mb={4}
      onClick={handleClick}
      pb={3}
      pl={4}
      pr={8}
      pt={3}
      role="alert"
      color="white"
    >
      <Icon as={FaInfoCircle} height={6} width={6} mr={3} />
      <Box textAlign="left">
        <Text fontWeight="bold">{t('newVersion')}</Text>
        {t('clickToRefresh')}
      </Box>
    </Flex>
  );
}

export function ServiceWorker(): null {
  const { t } = useTranslation('serviceWorker');
  const toast = useToast();
  // required to not re-register when e.g. language is changed and thus `t`
  const attemptedRegistration = useRef(false);

  useEffect(() => {
    const isDev = !IS_PROD && !IS_TEST;

    if (isDev) {
      if (!hasWarned) {
        // eslint-disable-next-line no-console
        console.info(
          '%c⚠️ [Karma/ServiceWorker] inactive during devopment! Change "ServiceWorker.tsx" as well as "next.config.js > offlineConfig > generateInDevMode" to enable.',
          'color: orange;'
        );
        hasWarned = true;
      }

      return;
    }

    if ('serviceWorker' in navigator && !attemptedRegistration.current) {
      attemptedRegistration.current = true;

      navigator.serviceWorker
        .register(sw)
        // eslint-disable-next-line promise/prefer-await-to-then
        .then((registration) => {
          const onUpdateFound = createOnUpdateFoundListener({
            registration,
            t,
            toast,
          });

          registration.addEventListener('updatefound', onUpdateFound);
        })
        // eslint-disable-next-line no-console, promise/prefer-await-to-then
        .catch(console.error);
    }
  }, [toast, t, attemptedRegistration]);

  return null;
}

type CreateOnStateChangeListenerParams = {
  toast: ReturnType<typeof useToast>;
  t: TFunction;
  installingWorker: ServiceWorker;
};

const createOnStateChangeListener =
  ({ toast, t, installingWorker }: CreateOnStateChangeListenerParams) =>
  () => {
    if (
      installingWorker.state !== 'installed' ||
      !navigator.serviceWorker.controller
    ) {
      return;
    }

    toast({
      render: () => <RefreshToast t={t} />,
    });
  };

type CreateOnUpdateFoundListenerParams = {
  toast: ReturnType<typeof useToast>;
  registration: ServiceWorkerRegistration;
  t: TFunction;
};

const createOnUpdateFoundListener =
  ({ toast, registration, t }: CreateOnUpdateFoundListenerParams) =>
  () => {
    const installingWorker = registration.installing;

    if (!installingWorker) {
      return;
    }

    const onStateChange = createOnStateChangeListener({
      installingWorker,
      t,
      toast,
    });

    installingWorker.addEventListener('statechange', onStateChange);
  };
