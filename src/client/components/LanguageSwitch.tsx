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
  MenuTransition,
} from '@chakra-ui/core';
import { TFunction } from 'i18next';
import { FlagIcon, FlagIconCode } from 'react-flag-kit';
import { useTranslation } from 'react-i18next';
import { MdTranslate } from 'react-icons/md';

import { ENABLED_LANGUAGES } from '../../constants';
import { makeChangeLanguageHandler } from '../i18n';
import { ExternalLink } from './ExternalLink';

type FlapMap = { [key: string]: FlagIconCode };

const flagMap: FlapMap = {
  de: 'DE',
  en: 'GB',
};

type LanguageSwitchProps = BoxProps;

export function LanguageSwitch(props: LanguageSwitchProps) {
  const { i18n, t } = useTranslation('i18n');
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box d="inline-block" {...props}>
      <Menu isLazy>
        <MenuButton as={Button} type="button" colorScheme="teal" width="100%">
          <Box d="inline-block" as={MdTranslate} focusable={false} mr="2" />
          {t('language-toggle')}
        </MenuButton>
        <MenuTransition>
          {(styles) => {
            return (
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
            );
          }}
        </MenuTransition>
      </Menu>
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
      isDisabled={isCurrentLanguage}
      isChecked={isCurrentLanguage}
      onClick={isCurrentLanguage ? undefined : makeChangeLanguageHandler(slug)}
    >
      <Box as="span" mr={2} display="inline-block">
        <FlagIcon aria-hidden code={flagMap[slug]} />
      </Box>
      {t(slug)}
    </MenuItemOption>
  );
}
