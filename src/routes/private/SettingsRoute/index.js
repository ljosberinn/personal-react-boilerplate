import React, { Suspense } from 'react';
import { Section, Title, Column, Box, Tab } from 'rbx';
import { useTranslation } from 'react-i18next';
import { Route, Link, Switch, useLocation } from 'react-router-dom';
import { faSlidersH, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { TemplatedHelmet, Icon } from '../../../components';
import LoadableComponent from '../../loadUtils';

const tabs = [
  {
    name: 'siteSettings',
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "private.settings.site" */ './SiteSettings'),
    ),
    path: '/settings/site',
    icon: faSlidersH,
  },
  {
    name: 'accountSettings',
    component: LoadableComponent(() =>
      import(
        /* webpackChunkName: "private.settings.account" */ './AccountSettings'
      ),
    ),
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
      <Section className="settings-bg" aria-labelledby="section-title">
        <Column.Group centered multiline>
          <Column size={10}>
            <Box>
              <Title id="section-title">{t('title')}</Title>

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

              <Suspense fallback={null}>
                <Switch>
                  {tabs.map(({ path, component }) => (
                    <Route exact path={path} component={component} key={path} />
                  ))}
                </Switch>
              </Suspense>
            </Box>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
