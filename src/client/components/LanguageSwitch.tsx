import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  useColorModeValue,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import type { MenuProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdTranslate } from 'react-icons/md';

import { ENABLED_LANGUAGES } from '../../constants';
import { useTranslation } from '../hooks/useTranslation';
import type { TFunction } from '../hooks/useTranslation';
import { ExternalLink } from './ExternalLink';
import { InternalLink } from './InternalLink';

export type LanguageSwitchAltProps = Omit<MenuProps, 'children' | 'isLazy'>;

export function LanguageSwitch(props: LanguageSwitchAltProps): JSX.Element {
  const { t, locale: currentLocale } = useTranslation('i18n');
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const buttonColor = useColorModeValue('gray.900', 'gray.100');
  const { asPath: currentPath } = useRouter();

  return (
    <Menu {...props} isLazy>
      <MenuButton
        as={IconButton}
        icon={<Icon as={MdTranslate} d="inline-block" />}
        aria-label={t('language-toggle')}
        color={buttonColor}
        background="none"
      />
      <MenuList>
        <MenuOptionGroup
          title={t('available-languages')}
          value={currentLocale}
          type="radio"
        >
          {ENABLED_LANGUAGES.map((locale) => (
            <LanguageOption
              currentPath={currentPath}
              isCurrentLocale={locale === currentLocale}
              locale={locale}
              t={t}
              key={locale}
            />
          ))}
        </MenuOptionGroup>
        <MenuDivider role={undefined} />
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
    </Menu>
  );
}

type LanguageOptionProps = {
  locale: string;
  currentPath: string;
  isCurrentLocale: boolean;
  t: TFunction;
};

const staticMenuItemOptionStyles = {
  ':focus': {
    boxShadow: 'initial',
  },
};

function LanguageOption({
  currentPath,
  isCurrentLocale,
  locale,
  t,
}: LanguageOptionProps) {
  return (
    <MenuItemOption
      as={InternalLink}
      locale={locale}
      href={currentPath}
      omitTextDecoration
      sx={staticMenuItemOptionStyles}
      isDisabled={isCurrentLocale}
      value={locale}
    >
      {t(locale)}
    </MenuItemOption>
  );
}
