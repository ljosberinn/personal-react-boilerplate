import type { MenuProps } from '@chakra-ui/core';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  chakra,
  MenuDivider,
  useColorModeValue,
  IconButton,
  Icon,
} from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { MdTranslate } from 'react-icons/md';

import { ENABLED_LANGUAGES } from '../../constants';
import type { TFunction } from '../hooks/useTranslation';
import { useTranslation } from '../hooks/useTranslation';
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

// const staticMenuItemOptionStyles = {
//   ':focus': {
//     boxShadow: 'initial',
//   },
// };

function LanguageOption({
  currentPath,
  isCurrentLocale,
  locale,
  t,
}: LanguageOptionProps) {
  return (
    <InternalLink
      locale={locale}
      omitTextDecoration
      href={currentPath}
      aria-disabled={isCurrentLocale}
      role="menuitemradio"
      textDecoration="none"
      color="inherit"
      userSelect="none"
      display="flex"
      width="100%"
      alignItems="center"
      textAlign="left"
      flex="0 0 auto"
      outline="0"
      transition="background 50ms ease-in 0s"
      px="0.4rem"
      py="0.8rem"
    >
      <chakra.span flexShrink={0} fontSize="smaller" mr="3">
        {isCurrentLocale && (
          <svg
            viewBox="0 0 14 14"
            width="1em"
            height="1em"
            focusable="false"
            aria-hidden="true"
            className="chakra-menu__icon"
          >
            <polygon
              fill="currentColor"
              points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"
            />
          </svg>
        )}
      </chakra.span>
      <chakra.span flex="1">{t(locale)}</chakra.span>
    </InternalLink>
  );

  // return (
  //   <MenuItemOption
  //     as={InternalLink}
  //     locale={locale}
  //     href={currentPath}
  //     omitTextDecoration
  //     sx={staticMenuItemOptionStyles}
  //     isDisabled={isCurrentLocale}
  //     value={locale}
  //   >
  //     {t(locale)}
  //   </MenuItemOption>
  // );
}
