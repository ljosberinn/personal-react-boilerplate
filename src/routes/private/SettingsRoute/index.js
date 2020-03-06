import { Section, Title, Box, Tab } from 'rbx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSlidersH, FaUserCog } from 'react-icons/fa';
import { Route, Link, Switch, useLocation } from 'react-router-dom';

import { TemplatedHelmet, Icon } from '../../../components';
import { withSentry } from '../../../hocs';
import LoadableComponent from '../../loadUtils';
import styles from './Settings.module.scss';

const tabs = [
  {
    name: 'siteSettings',
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "private.settings.site" */ './SiteSettings'),
    ),
    path: '/settings/site',
    icon: FaSlidersH,
  },
  {
    name: 'accountSettings',
    component: LoadableComponent(() =>
      import(
        /* webpackChunkName: "private.settings.account" */ './AccountSettings'
      ),
    ),
    path: '/settings/account',
    icon: FaUserCog,
  },
];

export default withSentry(function Settings() {
  const { t } = useTranslation('settings');
  const { pathname } = useLocation();

  return (
    <>
      <TemplatedHelmet>
        <title>{t('title')}</title>
      </TemplatedHelmet>
      <Section className={styles.container} aria-labelledby="section-title">
        <Box>
          <Title id="section-title">{t('title')}</Title>

          <Tab.Group kind="boxed">
            {tabs.map(({ name, path, icon }) => (
              <Tab as={Link} to={path} active={path === pathname} key={name}>
                <Icon svg={icon} />
                <span>{t(name)}</span>
              </Tab>
            ))}
          </Tab.Group>

          <Switch>
            {tabs.map(({ path, component }) => (
              <Route exact path={path} component={component} key={path} />
            ))}
          </Switch>
        </Box>
      </Section>
    </>
  );
});
