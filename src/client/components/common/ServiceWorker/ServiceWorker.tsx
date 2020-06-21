import { Box, useToast, Flex, Icon } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { IS_PROD } from '../../../../constants';
import { attachComponentBreadcrumb } from '../../../../utils/sentry';

const sw = '/service-worker.js';

function handleClick() {
  window.location.reload();
}

/**
 * Currently mimics toast({status: 'info'}) to allow a global onClick
 */
const RefreshToast = () => {
  const { t } = useTranslation('serviceWorker');

  return (
    <Flex
      backgroundColor="blue.500"
      pl={4}
      pr={8}
      pt={3}
      pb={3}
      borderRadius="0.25rem"
      m={2}
      onClick={handleClick}
      cursor="pointer"
      role="alert"
    >
      <Icon name="info" width="1.25rem" height="1.25rem" mr="0.75rem" />
      <Box textAlign="left">
        <Box as="p" fontWeight="bold">
          {t('newVersion')}
        </Box>
        {t('clickToRefresh')}
      </Box>
    </Flex>
  );
};

export default function ServiceWorker() {
  attachComponentBreadcrumb('ServiceWorker');

  const toast = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(sw)
        .then(registration => {
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;

            if (!installingWorker) {
              return;
            }

            installingWorker.addEventListener('statechange', () => {
              if (
                installingWorker.state !== 'installed' ||
                !navigator.serviceWorker.controller
              ) {
                return;
              }

              toast({
                render: RefreshToast,
              });
            });
          });
        })
        .catch(error => {
          if (!IS_PROD && error instanceof TypeError) {
            // eslint-disable-next-line no-console
            console.info(
              'ServiceWorker is currently deactivated.\nIf this is unintentional, please change `next.config.js.offlineConfig.generateInDevMode` to `true`.'
            );
            return;
          }

          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }, [toast]);

  return null;
}
