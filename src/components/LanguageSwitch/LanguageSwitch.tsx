import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Button,
  Box,
} from '@chakra-ui/core';
import React from 'react';
import { FlagIcon, FlagIconCode } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import { ENABLED_LANGUAGES } from '../../constants/env';
import { ExternalLink } from '../ExternalLink';
import { ns } from './i18n';

const flagMap = {
  en: 'GB',
  de: 'DE',
} as { [key: string]: FlagIconCode };

export default function LanguageSwitch() {
  const { i18n, t } = useTranslation(ns);

  function handleLanguageChange(slug: string) {
    return () => {
      i18n.changeLanguage(slug);
    };
  }

  return (
    <Menu>
      <MenuButton as={Button} data-testid="language-switch-btn">
        <Box as={MdTranslate} mr={2} />
        {t('menu-toggle')}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup title={t('available-languages')} value={i18n.language}>
          {ENABLED_LANGUAGES.map(slug => {
            const isCurrentLanguage = slug === i18n.language;

            return (
              <MenuItemOption
                data-testid={`language-switch-option-${slug}`}
                type="radio"
                value={slug}
                isDisabled={isCurrentLanguage}
                onClick={
                  isCurrentLanguage ? undefined : handleLanguageChange(slug)
                }
                key={slug}
              >
                <Box mr={2} display="inline-block">
                  <FlagIcon aria-hidden="true" code={flagMap[slug]} />
                </Box>
                {t(slug)}
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem>
          <ExternalLink
            href="//github.com/ljosberinn"
            data-testid="language-switch-help-cta"
          >
            {t('help-cta')}
          </ExternalLink>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
