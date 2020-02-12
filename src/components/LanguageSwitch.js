import { Navbar, Dropdown, Button } from 'rbx';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LocaleSvg } from '../assets/svg';
import { REPO_LINK, ENABLED_LANGUAGES } from '../constants/env';
import ExternalLink from './ExternalLink';

const validOrigins = ['footer', 'nav', 'settings'];

/**
 *
 * @param {{
 * from: 'footer' | 'nav' | 'settings'
 * }}
 */
export default function LanguageSwitch({ from }) {
  const { i18n, t } = useTranslation('languages');

  if (!validOrigins.includes(from)) {
    console.error(`unimplemented from-case for LanguageSwitch: ${from}`);
    return null;
  }

  const currentLanguage = i18n.languages[0];

  const dropdownContent = (
    <DropdownContent t={t} i18n={i18n} currentLanguage={currentLanguage} />
  );

  if (from !== 'nav') {
    return (
      <Dropdown up={from === 'footer'} hoverable>
        <Dropdown.Trigger>
          <Wrap from={from}>
            <LocaleSvg />
            {t(currentLanguage)}
          </Wrap>
        </Dropdown.Trigger>
        <Dropdown.Menu>{dropdownContent}</Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Navbar.Item dropdown hoverable>
      <Navbar.Link arrowless>
        <LocaleSvg />
        {t(currentLanguage)}
      </Navbar.Link>
      <Navbar.Dropdown>{dropdownContent}</Navbar.Dropdown>
    </Navbar.Item>
  );
}

/**
 *
 * @param {{
 * t: import('i18next').TFunction,
 * currentLanguage: string,
 * i18n: import ('i18next').i18n
 * }}
 */
function DropdownContent({ t, currentLanguage, i18n }) {
  return (
    <Dropdown.Content>
      {ENABLED_LANGUAGES.map(slug => (
        <Dropdown.Item
          active={slug === currentLanguage}
          onClick={() => i18n.changeLanguage(slug)}
          key={slug}
        >
          {t(slug)}
        </Dropdown.Item>
      ))}

      <Dropdown.Divider />
      <Dropdown.Item as={ExternalLink} href={`${REPO_LINK}#help-translating`}>
        {t('help')}
      </Dropdown.Item>
    </Dropdown.Content>
  );
}

/**
 *
 * @param {{
 * children: JSX.Element,
 * from: 'settings' | 'footer' | 'nav'
 * }}
 */
function Wrap({ children, from }) {
  if (from === 'settings') {
    return <Button>{children}</Button>;
  }

  return (
    <div className="is-flex" style={{ alignItems: 'center' }}>
      {children}
    </div>
  );
}
