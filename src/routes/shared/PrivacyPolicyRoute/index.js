import classnames from 'classnames';
import { Section, Column, Card, Box, Content, Title } from 'rbx';
import React from 'react';
import { Slide as AwesomeSlide, Fade } from 'react-awesome-reveal';
import { useTranslation, Trans } from 'react-i18next';

import { TemplatedHelmet, ExternalLink } from '../../../components';
import {
  AdSvg,
  CookieSvg,
  SecuritySvg,
  AnalyticsSvg,
} from '../../../components/themedSvgs';

import styles from './PrivacyPolicy.module.scss';

const content = [
  {
    key: 'analytics',
    entries: [
      { id: 1, placeholder: '' },
      { id: 2, placeholder: '' },
      {
        id: 3,
        placeholder: (
          <>
            Logs provided by{' '}
            <ExternalLink href="//sentry.io">Sentry</ExternalLink> and/or{' '}
            <ExternalLink href="//logrocket.com">LogRocket</ExternalLink> may
            contain information such as ip address and browser & OS metadata.
          </>
        ),
      },
    ],
    icon: AnalyticsSvg,
  },
  {
    key: 'thirdParty',
    entries: [
      { id: 1, placeholder: '' },
      {
        id: 2,
        placeholder: (
          <>
            Our identity provider is{' '}
            <ExternalLink href="//netlify.com">Netlify</ExternalLink>.
          </>
        ),
      },
      {
        id: 3,
        placeholder: (
          <>
            Your application data is stored on servers of{' '}
            <ExternalLink href="//fauna.com/">Fauna</ExternalLink>.
          </>
        ),
      },
    ],
    icon: SecuritySvg,
  },
  {
    key: 'cookies',
    entries: [
      {
        id: 1,
        placeholder: (
          <>
            This site relies on a browser feature called{' '}
            <code>localStorage</code>. This enables us to not require any
            cookies.
          </>
        ),
      },
      { id: 2, placeholder: '' },
    ],
    icon: CookieSvg,
  },
  {
    key: 'ads',
    entries: [
      { id: 1, placeholder: '' },
      { id: 2, placeholder: '' },
    ],
    icon: AdSvg,
  },
];

export default function PrivacyPolicy() {
  const { t } = useTranslation(['routes', 'privacyPolicy']);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('privacyPolicy')}</title>
      </TemplatedHelmet>

      <Section className="privacy-bg" aria-labelledby="section-title">
        <Fade triggerOnce>
          <Title id="section-title">{t('privacyPolicy')}</Title>
        </Fade>
        {content.map((dataset, index) => (
          <Slide dataset={dataset} key={index} index={index} t={t} />
        ))}
      </Section>
    </>
  );
}

/**
 *
 * @param {{
 * dataset: {
 *  title: string,
 *  entries: (string|JSX.Element)[],
 *  icon: string,
 *  t: import('i18next').TFunction,
 * }[],
 * index: number
 * }}
 */
function Slide({ dataset: { key, icon: Icon, entries }, index, t }) {
  const direction = index % 2 === 0 ? 'left' : 'right';

  return (
    <AwesomeSlide
      direction={direction}
      delay={index * 333}
      triggerOnce
      className={classnames(
        styles.container,
        direction === 'right' && styles.right,
      )}
    >
      <Box className={styles.box}>
        <Card className={styles.card}>
          <Card.Header className={styles.cardHeader}>
            <Card.Header.Title>
              {t(`privacyPolicy:${key}Title`)}
            </Card.Header.Title>
          </Card.Header>
          <Card.Content>
            <Content>
              <Column.Group vcentered>
                <Column className="is-flex">
                  <Icon height="100%" aria-hidden className={styles.icon} />
                </Column>
                <Column size={9}>
                  <ul className={styles.ul}>
                    {entries.map(({ id, placeholder }, index) => (
                      <Trans
                        i18nKey={`${key}${id}`}
                        ns="privacyPolicy"
                        parent="li"
                        className={styles.li}
                        key={index}
                      >
                        {placeholder}
                      </Trans>
                    ))}
                  </ul>
                </Column>
              </Column.Group>
            </Content>
          </Card.Content>
        </Card>
      </Box>
    </AwesomeSlide>
  );
}
