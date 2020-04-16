import { Menu, MenuButton, MenuList, Box } from '@chakra-ui/core';
import * as React from 'react';
import { FaWhatsapp, FaFacebookMessenger, FaSms } from 'react-icons/fa';

import { CustomIcon } from '../../CustomIcon';

export default function Mobile() {
  return (
    <>
      <CustomIcon size="4" icon={FaWhatsapp} />
      <CustomIcon icon={FaFacebookMessenger} />
      <CustomIcon icon={FaSms} />
    </>
  );
}
