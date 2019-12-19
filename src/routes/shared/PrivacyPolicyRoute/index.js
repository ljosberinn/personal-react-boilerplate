import React from 'react';
import { Section } from 'rbx';
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
        <h1>WIP</h1>
      </Section>
    </>
  );
}
