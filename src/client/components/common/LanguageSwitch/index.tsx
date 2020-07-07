import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Button,
  BoxProps,
  useColorModeValue,
} from '@chakra-ui/core';
import { TFunction } from 'i18next';
import React from 'react';
import { FlagIcon, FlagIconCode } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import {
  SUPPORTED_LANGUAGES_MAP,
  ENABLED_LANGUAGES,
} from '../../../../constants';
import { getI18N } from '../../../i18n';
import { ExternalLink } from '../ExternalLink';

type FlapMap = { [key: string]: FlagIconCode };

const flagMap: FlapMap = {
  [SUPPORTED_LANGUAGES_MAP.en]: 'GB',
  [SUPPORTED_LANGUAGES_MAP.de]: 'DE',
};

type LanguageSwitchProps = BoxProps;

export function LanguageSwitch(props: LanguageSwitchProps) {
  const { i18n, t } = useTranslation('i18n');
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  function handleLanguageChange(slug: string) {
    return async () => {
      const hasBundle = !!i18n.getDataByLanguage(slug);

      if (!hasBundle) {
        const bundles = await getI18N(slug);

        Object.entries(bundles).forEach(([ns, bundle]) => {
          i18n.addResourceBundle(slug, ns, bundle);
        });
      }

      await i18n.changeLanguage(slug);
    };
  }

  return (
    <Box d="inline-block" {...props}>
      <Menu>
        <MenuButton as={Button} colorScheme="teal" width="100%">
          <Box d="inline-block" as={MdTranslate} mr={2} />
          {t('language-toggle')}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            title={t('available-languages')}
            value={i18n.language}
            type="radio"
          >
            {ENABLED_LANGUAGES.map(slug => (
              <LanguageOption
                t={t}
                slug={slug}
                isCurrentLanguage={slug === i18n.language}
                handleLanguageChange={handleLanguageChange}
                key={slug}
              />
            ))}
          </MenuOptionGroup>
          <MenuDivider />
          <MenuItem
            as={ExternalLink}
            _focus={{
              backgroundColor,
              boxShadow: 'unset',
            }}
            href="//github.com/chevron-9/next-with-batteries-docs"
          >
            {t('help-cta')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}

interface LanguageOptionProps {
  slug: string;
  isCurrentLanguage: boolean;
  handleLanguageChange: (slug: string) => () => Promise<void>;
  t: TFunction;
}

function LanguageOption({
  slug,
  isCurrentLanguage,
  handleLanguageChange,
  t,
}: LanguageOptionProps) {
  return (
    <MenuItemOption
      value={slug}
      isDisabled={isCurrentLanguage}
      // @ts-expect-error
      isChecked={isCurrentLanguage}
      onClick={isCurrentLanguage ? undefined : handleLanguageChange(slug)}
    >
      <Box mr={2} display="inline-block">
        <FlagIcon aria-hidden="true" code={flagMap[slug]} />
      </Box>
      {t(slug)}
    </MenuItemOption>
  );
}
