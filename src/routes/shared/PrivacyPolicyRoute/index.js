import React from 'react';
import { Section, Title } from 'rbx';
import { TemplatedHelmet } from '../../../components';
import { useTranslation } from 'react-i18next';

/**
 * @returns {React.FC}
 */
export default function PrivacyPolicy() {
  const { t } = useTranslation(['routes', 'privacyPolicy']);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('privacyPolicy')}</title>
      </TemplatedHelmet>
      <Section>
        <Title>WIP</Title>
      </Section>
    </>
  );
}
