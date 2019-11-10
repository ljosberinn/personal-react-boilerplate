import React from 'react';
import Helmet from 'react-helmet';
import { Section, Title, Box, Column } from 'rbx';
import AccountSettings from './AccountSettings';
import SiteSettings from './SiteSettings';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation('settings');

  return (
    <>
      <Helmet>
        <title>
          {t('title')} | {process.env.REACT_APP_BRAND_NAME}
        </title>
      </Helmet>
      <Section className="settings-bg">
        <Column.Group centered multiline>
          <Column size={10}>
            <Title>{t('title')}</Title>
          </Column>

          <Column size={5}>
            <Box>
              <SiteSettings />
            </Box>
          </Column>
          <Column size={5}>
            <Box>
              <AccountSettings />
            </Box>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
