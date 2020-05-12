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
} from '@chakra-ui/core';
import React from 'react';
import { FlagIcon, FlagIconCode } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';
import { fetchTranslations } from 'src/client/i18n';
import { ENABLED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from 'src/constants';

import { CustomIcon } from '../CustomIcon';
import { ExternalLink } from '../ExternalLink';

const flagMap = {
  [SUPPORTED_LANGUAGES_MAP.en]: 'GB',
  [SUPPORTED_LANGUAGES_MAP.de]: 'DE',
} as { [key: string]: FlagIconCode };

interface Props {
  ml?: number;
  mr?: number;
}

export default function LanguageSwitch({ ml = 0, mr = 0 }: Props) {
  const { i18n, t } = useTranslation();

  function handleLanguageChange(slug: string) {
    return async () => {
      const missingNamespaces = i18n.reportNamespaces
        .getUsedNamespaces()
        .filter(namespace => !i18n.hasResourceBundle(slug, namespace));

      const bundles = await Promise.all(
        missingNamespaces.map(namespace => fetchTranslations(slug, namespace))
      );

      bundles.forEach((bundle, index) => {
        const namespace = missingNamespaces[index];

        i18n.addResourceBundle(slug, namespace, bundle);
      });

      i18n.changeLanguage(slug);
    };
  }

  return (
    <Box ml={ml} mr={mr}>
      <Menu>
        <MenuButton as={Button} data-testid="language-switch-btn">
          <CustomIcon icon={MdTranslate} mr={2} />
          {t('menu-toggle')}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            title={t('available-languages')}
            value={i18n.language}
          >
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
    </Box>
  );
}
