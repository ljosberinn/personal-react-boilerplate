import type { MenuProps } from '@chakra-ui/core';
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
  useColorModeValue,
  MenuTransition,
  Icon,
} from '@chakra-ui/core';
import type { TFunction } from 'i18next';
import type { FlagIconCode } from 'react-flag-kit';
import { FlagIcon } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import { createLanguageChangeHandler } from '../../../karma/client/i18n';
import { ENABLED_LANGUAGES } from '../../constants';
import { ExternalLink } from './ExternalLink';

type FlapMap = Record<string, FlagIconCode>;

const flagMap: FlapMap = {
  de: 'DE',
  en: 'GB',
};

export type LanguageSwitchProps = Omit<MenuProps, 'children' | 'isLazy'>;

export function LanguageSwitch(props: LanguageSwitchProps): JSX.Element {
  const { i18n, t } = useTranslation('i18n');
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box as={Menu} d="inline-block" {...props} isLazy>
      <MenuButton
        as={Button}
        type="button"
        colorScheme="teal"
        leftIcon={<Icon d="inline-block" as={MdTranslate} />}
      >
        {t('language-toggle')}
      </MenuButton>
      <MenuTransition>
        {(styles) => (
          <MenuList sx={styles}>
            <MenuOptionGroup
              title={t('available-languages')}
              defaultValue={i18n.language}
              type="radio"
            >
              {ENABLED_LANGUAGES.map((slug) => (
                <LanguageOption
                  t={t}
                  slug={slug}
                  isCurrentLanguage={slug === i18n.language}
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
              href="//github.com/ljosberinn/next-karma-docs"
            >
              {t('help-cta')}
            </MenuItem>
          </MenuList>
        )}
      </MenuTransition>
    </Box>
  );
}

interface LanguageOptionProps {
  slug: string;
  isCurrentLanguage: boolean;
  t: TFunction;
}

function LanguageOption({ slug, isCurrentLanguage, t }: LanguageOptionProps) {
  return (
    <MenuItemOption
      value={slug}
      disabled={isCurrentLanguage}
      isChecked={isCurrentLanguage}
      onClick={
        isCurrentLanguage ? undefined : createLanguageChangeHandler(slug)
      }
    >
      <Icon
        as={FlagIcon}
        aria-hidden
        code={flagMap[slug]}
        mr={2}
        display="inline-block"
      />
      {t(slug)}
    </MenuItemOption>
  );
}
