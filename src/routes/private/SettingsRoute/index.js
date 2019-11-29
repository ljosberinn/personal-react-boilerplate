import React from 'react';
import { Section, Title, Box, Column } from 'rbx';
import AccountSettings from './AccountSettings';
import SiteSettings from './SiteSettings';
import { useTranslation } from 'react-i18next';
import { TemplatedHelmet } from '../../../components';

export default function Settings() {
  const { t } = useTranslation('settings');

  return (
    <>
      <TemplatedHelmet>
        <title>{t('title')}</title>
      </TemplatedHelmet>
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
