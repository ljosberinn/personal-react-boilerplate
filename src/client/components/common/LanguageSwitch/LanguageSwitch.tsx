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
  useColorMode,
} from '@chakra-ui/core';
import { COOKIE_LOOKUP_KEY_LANG } from '@unly/universal-language-detector';
import cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { FlagIcon, FlagIconCode } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import {
  SUPPORTED_LANGUAGES_MAP,
  IS_BROWSER,
  ENABLED_LANGUAGES,
  REPOSITORY_LINK,
} from '../../../../constants';
import { fetchTranslations } from '../../../i18n';
import { ExternalLink } from '../ExternalLink';

type FlapMap = { [key: string]: FlagIconCode };

const flagMap: FlapMap = {
  [SUPPORTED_LANGUAGES_MAP.en]: 'GB',
  [SUPPORTED_LANGUAGES_MAP.de]: 'DE',
};

type LanguageSwitchProps = BoxProps;

export default function LanguageSwitch(props: LanguageSwitchProps) {
  const { i18n, t } = useTranslation();
  const { colorMode } = useColorMode();

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

  useEffect(() => {
    if (IS_BROWSER) {
      document.querySelector('html')!.setAttribute('lang', i18n.language);
    }
  }, [i18n.language]);

  return (
    <Box {...props}>
      <Menu>
        <MenuButton
          as={Button}
          {...{ variantColor: 'teal' }}
          data-testid="language-switch-btn"
        >
          <Box d="inline-block" as={MdTranslate} mr={2} />
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
          <MenuItem
            as={ExternalLink}
            _focus={{
              boxShadow: 'unset',
              // see https://github.com/chakra-ui/chakra-ui/blob/master/packages/chakra-ui/src/Menu/styles.js#L38
              backgroundColor:
                colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100',
            }}
            data-testid="language-switch-help-cta"
            {...{ href: REPOSITORY_LINK }}
          >
            {t('help-cta')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
