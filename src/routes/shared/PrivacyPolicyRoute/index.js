import React, { Fragment } from 'react';
import { Section, Column, Card, Box, Content, Title } from 'rbx';
import { TemplatedHelmet, ExternalLink } from '../../../components';
import { useTranslation, Trans } from 'react-i18next';
import styles from './PrivacyPolicy.module.scss';
import { Slide as AwesomeSlide, Fade } from 'react-awesome-reveal';
import classnames from 'classnames';
import {
  AdSvg,
  CookieSvg,
  SecuritySvg,
  AnalyticsSvg,
} from '../../../components/themedSvgs';

/**
 * @returns {React.FC}
 */
export default function PrivacyPolicy() {
  const { t } = useTranslation(['routes', 'privacyPolicy']);

  const content = [
    {
      title: 'analytics-title',
      entries: [
        'analytics-1',
        'analytics-2',
        <Trans
          i18nKey="analytics-3"
          ns="privacyPolicy"
          parent="li"
          className={styles.li}
        >
          Logs provided by{' '}
          <ExternalLink href="//sentry.io">Sentry</ExternalLink> and/or{' '}
          <ExternalLink href="//logrocket.com">LogRocket</ExternalLink> may
          contain information such as ip address and browser & OS metadata.
        </Trans>,
      ],
      icon: AnalyticsSvg,
    },
    {
      title: 'third-party-title',
      entries: [
        'third-party-1',
        <Trans
          i18nKey="third-party-2"
          ns="privacyPolicy"
          parent="li"
          className={styles.li}
        >
          Our identity provider is{' '}
          <ExternalLink href="//netlify.com">Netlify</ExternalLink>.
        </Trans>,
        <Trans
          i18nKey="third-party-3"
          ns="privacyPolicy"
          parent="li"
          className={styles.li}
        >
          Your application data is stored on servers of{' '}
          <ExternalLink href="//fauna.com/">FaunaDB</ExternalLink>.
        </Trans>,
      ],
      icon: SecuritySvg,
    },
    {
      title: 'cookies-title',
      entries: [
        <Trans
          i18nKey="cookies-1"
          ns="privacyPolicy"
          parent="li"
          className={styles.li}
        >
          This site relies on a browser feature called <code>localStorage</code>
          . This enables us to not require any cookies.
        </Trans>,
        'cookies-2',
      ],
      icon: CookieSvg,
    },
    {
      title: 'ads-title',
      entries: ['ads-1', 'ads-2'],
      icon: AdSvg,
    },
  ];

  return (
    <>
      <TemplatedHelmet>
        <title>{t('privacyPolicy')}</title>
      </TemplatedHelmet>

      <Section className="privacy-bg">
        <Fade triggerOnce>
          <Title>{t('privacyPolicy')}</Title>
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
 * @returns {React.FC<{
 * dataset: {
 *  title: string,
 *  entries: (string|React.ComponentType)[],
 *  icon: string,
 *  t: import('i18next').TFunction,
 * }[],
 * index: number
 * }>} Slide
 */
function Slide({ dataset: { title, icon: Icon, entries }, index, t }) {
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
            <Card.Header.Title>{t(`privacyPolicy:${title}`)}</Card.Header.Title>
          </Card.Header>
          <Card.Content>
            <Content>
              <Column.Group vcentered>
                <Column className="is-flex">
                  <Icon height="100%" aria-hidden className={styles.icon} />
                </Column>
                <Column size={9}>
                  <ul className={styles.ul}>
                    {entries.map((entry, index) => {
                      if (typeof entry === 'string') {
                        return (
                          <li className={styles.li} key={index}>
                            {t(`privacyPolicy:${entry}`)}
                          </li>
                        );
                      }

                      return <Fragment key={index}>{entry}</Fragment>;
                    })}
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
