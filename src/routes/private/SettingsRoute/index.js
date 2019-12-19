import React from 'react';
import { Section, Title, Column, Box, Tab } from 'rbx';
import AccountSettings from './AccountSettings';
import SiteSettings from './SiteSettings';
import { useTranslation } from 'react-i18next';
import { TemplatedHelmet, Icon } from '../../../components';
import { Route, Link, Switch, useLocation } from 'react-router-dom';
import { faSlidersH, faUserCog } from '@fortawesome/free-solid-svg-icons';

const tabs = [
  {
    name: 'siteSettings',
    component: SiteSettings,
    path: '/settings/site',
    icon: faSlidersH,
  },
  {
    name: 'accountSettings',
    component: AccountSettings,
    path: '/settings/account',
    icon: faUserCog,
  },
];

export default function Settings() {
  const { t } = useTranslation('settings');
  const { pathname } = useLocation();

  return (
    <>
      <TemplatedHelmet>
        <title>{t('title')}</title>
      </TemplatedHelmet>
      <Section className="settings-bg">
        <Column.Group centered multiline>
          <Column size={10}>
            <Box>
              <Title>{t('title')}</Title>

              <Tab.Group kind="boxed">
                {tabs.map(({ name, path, icon }) => (
                  <Tab
                    as={Link}
                    to={path}
                    key={name}
                    active={path === pathname}
                  >
                    <Icon icon={icon} />
                    <span>{t(name)}</span>
                  </Tab>
                ))}
              </Tab.Group>

              <Switch>
                <Route exact path="/settings/site" component={SiteSettings} />

                <Route
                  exact
                  path="/settings/account"
                  component={AccountSettings}
                />
              </Switch>
            </Box>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
