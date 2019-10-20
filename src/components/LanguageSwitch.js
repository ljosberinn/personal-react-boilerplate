import React from 'react';
import { LocaleSvg } from '../assets/svg';
import { Navbar, Dropdown } from 'rbx';

// TODO: get from backend

const availableLanguages = [
  { slug: 'de', name: 'Deutsch' },
  { slug: 'en', name: 'English' },
  { slug: 'fr', name: 'Francais' },
  { slug: 'jp', name: 'Japanese' },
  { slug: 'ru', name: 'Russian' },
  { slug: 'es', name: 'Spanish' },
];
const supportText = 'Language missing? Help translating!';

export default function LanguageSwitch({ footer }) {
  // TODO: useTranslation via react-i18next
  if (footer) {
    return (
      <Dropdown up hoverable>
        <Dropdown.Trigger>
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <LocaleSvg />
            English
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Content>
            {availableLanguages.map(({ slug, name }) => (
              <Dropdown.Item key={slug}>{name}</Dropdown.Item>
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
      <Navbar.Link arrowless>
        <LocaleSvg />
        English
      </Navbar.Link>
      <Navbar.Dropdown>
        {availableLanguages.map(({ slug, name }) => (
          <Navbar.Item key={slug}>{name}</Navbar.Item>
        ))}
        <Navbar.Divider />
        <Navbar.Item>{supportText}</Navbar.Item>
      </Navbar.Dropdown>
    </Navbar.Item>
  );
}
