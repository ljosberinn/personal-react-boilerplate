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
import { COOKIE_LOOKUP_KEY_LANG } from '@unly/universal-language-detector';
import cookies from 'js-cookie';
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

interface LanguageSwitchProps {
  ml?: number;
  mr?: number;
}

export default function LanguageSwitch({
  ml = 0,
  mr = 0,
}: LanguageSwitchProps) {
  const { i18n, t } = useTranslation();

  function handleLanguageChange(slug: string) {
    return async () => {
      // prevent loading data 2x which happens for some reason when
      // going from initial language -> other lang -> back
      if (!i18n.getDataByLanguage(slug)) {
        const { protocol, host } = window.location;
        const baseUrl = `${protocol}//${host}`;

        const bundles = await fetchTranslations(slug, baseUrl);

        Object.entries(bundles).forEach(([ns, bundle]) => {
          i18n.addResourceBundle(slug, ns, bundle);
        });
      }

      cookies.set(COOKIE_LOOKUP_KEY_LANG, slug);
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
