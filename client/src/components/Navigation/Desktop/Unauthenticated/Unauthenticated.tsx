import { Button, Box } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt } from 'react-icons/fa';

import { useAuth0 } from '../../../../hooks/useAuth0';

export default function Unauthenticated() {
  const { t } = useTranslation();
  const { loginWithPopup } = useAuth0();

  return (
    <Button ml={2} onClick={loginWithPopup}>
      <Box as={FaSignInAlt} mr={2} /> {t('login')}
    </Button>
  );
}
