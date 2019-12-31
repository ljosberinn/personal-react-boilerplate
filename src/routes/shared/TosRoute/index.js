import React from 'react';
import { Section, Title, Column } from 'rbx';
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
      <Section className="tos-bg" aria-labelledby="section-title">
        <Column.Group>
          <Column size="two-third" offset={2}>
            <Title id="section-title">{t('tos')}</Title>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
