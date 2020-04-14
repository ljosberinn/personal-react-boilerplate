import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '../../../hooks/useNavigation';
import { RouteDefinition } from '../../../routes';
import { CustomIcon } from '../../CustomIcon';

export default function Link({ to }: { to: RouteDefinition }) {
  const { t } = useTranslation();
  const { PreloadingLink } = useNavigation();

  return (
    <Text mt={1} mb={1}>
      <PreloadingLink to={to}>
        <CustomIcon icon={to.icon} mr={2} />
        <Box as="span">{t(to.title as string)}</Box>
      </PreloadingLink>
    </Text>
  );
}
