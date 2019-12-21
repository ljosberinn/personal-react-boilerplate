import React from 'react';
import { Section, Title } from 'rbx';
import { TemplatedHelmet } from '../../../components';
import { useTranslation } from 'react-i18next';

/**
 * @returns {React.FC}
 */
export default function TosRoute() {
  const { t } = useTranslation(['routes', 'termsOfService']);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('tos')}</title>
      </TemplatedHelmet>
      <Section>
        <Title>WIP</Title>
      </Section>
    </>
  );
}
