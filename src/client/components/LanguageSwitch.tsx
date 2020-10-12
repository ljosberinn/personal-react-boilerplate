import type { MenuItemOptionProps, MenuProps } from '@chakra-ui/core';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  useColorModeValue,
  MenuTransition,
  IconButton,
  Icon,
} from '@chakra-ui/core';
import type { TFunction } from 'i18next';
import type { FlagIconCode } from 'react-flag-kit';
import { FlagIcon } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import { ENABLED_LANGUAGES } from '../../constants';
import { useI18nRouting } from '../hooks/useI18nRouting';
import { ExternalLink } from './ExternalLink';

type FlapMap = Record<string, FlagIconCode>;

const flagMap: FlapMap = {
  de: 'DE',
  en: 'GB',
};

export type LanguageSwitchAltProps = Omit<MenuProps, 'children' | 'isLazy'>;

export function LanguageSwitch(props: LanguageSwitchAltProps): JSX.Element {
  const { i18n, t } = useTranslation('i18n');
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const buttonColor = useColorModeValue('gray.900', 'gray.100');

  const { createChangeLocaleHandler } = useI18nRouting();

  return (
    <Menu {...props} isLazy>
      <MenuButton
        as={IconButton}
        icon={<Icon as={MdTranslate} d="inline-block" />}
        aria-label={t('language-toggle')}
        color={buttonColor}
        background="none"
      />
      <MenuTransition>
        {(styles) => (
          <MenuList sx={styles}>
            <MenuOptionGroup
              title={t('available-languages')}
              defaultValue={i18n.language}
              type="radio"
            >
              {ENABLED_LANGUAGES.map((slug) => {
                const isCurrentLanguage = slug === i18n.language;

                const onClick = isCurrentLanguage
                  ? undefined
                  : createChangeLocaleHandler(slug);

                return (
                  <LanguageOption
                    t={t}
                    disabled={isCurrentLanguage}
                    isChecked={isCurrentLanguage}
                    slug={slug}
                    onClick={onClick}
                    key={slug}
                  />
                );
              })}
            </MenuOptionGroup>
            <MenuDivider />
            <MenuItem
              as={ExternalLink}
              _focus={{
                backgroundColor,
                boxShadow: 'unset',
              }}
              omitTextDecoration
              href="//github.com/ljosberinn/next-karma-docs"
            >
              {t('help-cta')}
            </MenuItem>
          </MenuList>
        )}
      </MenuTransition>
    </Menu>
  );
}

type LanguageOptionProps = Omit<
  MenuItemOptionProps,
  'disabled' | 'isChecked' | 'onClick'
> & {
  isChecked: boolean;
  disabled: boolean;
  onClick?: () => Promise<void>;
  slug: string;
  t: TFunction;
};

function LanguageOption({ t, slug, ...rest }: LanguageOptionProps) {
  return (
    <MenuItemOption {...rest} value={slug}>
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
