import React from 'react';
import { LocaleSvg } from '../assets/svg';
import { Navbar, Dropdown } from 'rbx';
import { Icon } from '.';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

// TODO: get from backend
const availableLanguages = ['DE', 'EN', 'JP', 'RU', 'FR', 'ES'];
const supportText = 'Language missing? Help translating!';

export default function LanguageSwitch({ footer }) {
  // TODO: useTranslation via react-i18next
  if (footer) {
    return (
      <Dropdown up hoverable>
        <Dropdown.Trigger>
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <LocaleSvg />
            <Icon icon={faAngleUp} size="small" />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Content>
            {availableLanguages.map(language => (
              <Dropdown.Item key={language}>{language}</Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item>{supportText}</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Navbar.Item dropdown hoverable>
      <Navbar.Link>
        <LocaleSvg />
      </Navbar.Link>
      <Navbar.Dropdown>
        {availableLanguages.map(language => (
          <Navbar.Item key={language}>{language}</Navbar.Item>
        ))}
        <Navbar.Divider />
        <Navbar.Item>{supportText}</Navbar.Item>
      </Navbar.Dropdown>
    </Navbar.Item>
  );
}
