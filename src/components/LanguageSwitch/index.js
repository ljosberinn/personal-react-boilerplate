import PropTypes from 'prop-types';
import { Navbar, Dropdown, Button } from 'rbx';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LocaleSvg } from '../../assets/svg';
import { REPO_LINK, ENABLED_LANGUAGES } from '../../constants/env';
import ExternalLink from '../ExternalLink';
import styles from './LanguageSwitch.module.scss';

export const validOrigins = ['footer', 'nav', 'settings'];

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

  const ariaId = `dropdown-lng-${from}`;

  if (from !== 'nav') {
    const isFooter = from === 'footer';

    return (
      <Dropdown
        up={isFooter}
        hoverable
        className={isFooter ? styles.pointer : undefined}
        aria-haspopup="true"
        aria-controls={ariaId}
      >
        <Dropdown.Trigger>
          <Wrap from={from}>
            <LocaleSvg />
            {t(currentLanguage)}
          </Wrap>
        </Dropdown.Trigger>
        <Dropdown.Menu id={ariaId}>{dropdownContent}</Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <Navbar.Item dropdown hoverable aria-haspopup="true" aria-controls={ariaId}>
      <Navbar.Link arrowless>
        <LocaleSvg />
        {t(currentLanguage)}
      </Navbar.Link>
      <Navbar.Dropdown id={ariaId}>{dropdownContent}</Navbar.Dropdown>
    </Navbar.Item>
  );
}

LanguageSwitch.propTypes = {
  from: PropTypes.oneOf(validOrigins).isRequired,
};

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
          data-testid={`lang-switch-${slug}`}
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

DropdownContent.propTypes = {
  t: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  i18n: PropTypes.shape().isRequired,
};

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

Wrap.propTypes = {
  from: PropTypes.oneOf(validOrigins).isRequired,
};
