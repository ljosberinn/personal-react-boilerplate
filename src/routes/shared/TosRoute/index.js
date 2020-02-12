import { Section, Title } from 'rbx';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TemplatedHelmet } from '../../../components';
import styles from './Tos.module.scss';

export default function TosRoute() {
  const { t } = useTranslation(['routes', 'termsOfService']);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('tos')}</title>
      </TemplatedHelmet>
      <Section
        className={`has-background-svg ${styles.container}`}
        aria-labelledby="section-title"
      >
        <Title id="section-title">{t('tos')}</Title>
      </Section>
    </>
  );
}
