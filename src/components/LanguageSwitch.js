import React, { useCallback } from 'react';
import { LocaleSvg } from '../assets/svg';
import { Navbar, Dropdown, Button } from 'rbx';
import { useTranslation } from 'react-i18next';

// TODO: get from backend
export const availableLanguages = ['de', 'en', 'fr', 'jp', 'ru', 'es'].sort();

export default function LanguageSwitch({ from }) {
  const { i18n, t } = useTranslation('languages');

  const currentLanguage = i18n.languages[0];

  const handleLanguageChange = useCallback(
    slug => () => i18n.changeLanguage(slug),
    [i18n],
  );

  const dropdownContent = (
    <Dropdown.Content>
      {availableLanguages.map(slug => (
        <Dropdown.Item
          active={slug === currentLanguage}
          onClick={handleLanguageChange(slug)}
          key={slug}
        >
          {t(slug)}
        </Dropdown.Item>
      ))}

      <Dropdown.Divider />
      <Dropdown.Item>{t('help')}</Dropdown.Item>
    </Dropdown.Content>
  );

  if (from !== 'nav') {
    const Wrap = ({ children }) =>
      from === 'settings' ? (
        <Button>{children}</Button>
      ) : (
        <div className="is-flex" style={{ alignItems: 'center' }}>
          {children}
        </div>
      );

    return (
      <Dropdown up={from === 'footer'} hoverable>
        <Dropdown.Trigger>
          <Wrap>
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
