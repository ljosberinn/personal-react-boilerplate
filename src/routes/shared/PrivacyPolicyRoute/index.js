import React from 'react';
import { Section, Column, Card, Box, Content, Title } from 'rbx';
import { TemplatedHelmet, ExternalLink } from '../../../components';
import { useTranslation } from 'react-i18next';
import styles from './PrivacyPolicy.module.scss';
import { Slide as AwesomeSlide, Fade } from 'react-awesome-reveal';
import classnames from 'classnames';

import AnalyticsSvg from '../../../assets/svg/AnalyticsSvg';
import SecuritySvg from '../../../assets/svg/SecuritySvg';
import CookieSvg from '../../../assets/svg/CookieSvg';
import AdSvg from '../../../assets/svg/AdSvg';

const content = [
  {
    title: 'No Usage Analytics',
    entries: [
      'We do not collect any direct analytics!',
      `However, in case of crashes or bugs/bug reports, logs
      may be evaluated to ensure the future stability of the
      platform.`,
      <>
        Logs provided by <ExternalLink href="//sentry.io">Sentry</ExternalLink>{' '}
        and/or <ExternalLink href="//logrocket.com">LogRocket</ExternalLink> may
        contain information such as ip address and browser & OS metadata.
      </>,
    ],
    icon: AnalyticsSvg,
  },
  {
    title: 'No Third-Party Data Access',
    entries: [
      `Your data is not sold to anyone and, given there are
no security breaches on your or our data providers
side, no unauthorized person can access your data.`,
      <>
        Our identity provider is{' '}
        <ExternalLink href="//netlify.com">Netlify</ExternalLink>.
      </>,
      <>
        Your application data is stored on servers of{' '}
        <ExternalLink href="//fauna.com/">FaunaDB</ExternalLink>.
      </>,
    ],
    icon: SecuritySvg,
  },
  {
    title: 'No Cookies',
    entries: [
      <>
        This site relies on a browser feature called <code>localStorage</code>.
        This enables us to not require any cookies.
      </>,
      'However, old devices/browsers pay the price as this feature is not supported there.',
    ],
    icon: CookieSvg,
  },
  {
    title: 'No Ads',
    entries: [
      "This site has never and won't ever show ads.",
      'As a direct result, no ad provider is hiddenly collecting data either.',
    ],
    icon: AdSvg,
  },
];

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

      <Section className="privacy-bg">
        <Fade triggerOnce>
          <Title>{t('privacyPolicy')}</Title>
        </Fade>
        {content.map((dataset, index) => (
          <Slide dataset={dataset} key={index} index={index} />
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
 *  entries: string[]|React.ComponentType[],
 *  icon: string,
 * }[],
 * index: number
 * }>} Slide
 */
function Slide({ dataset: { title, icon: Icon, entries }, index }) {
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
            <Card.Header.Title>{title}</Card.Header.Title>
          </Card.Header>
          <Card.Content>
            <Content>
              <Column.Group vcentered>
                <Column className="is-flex">
                  <Icon height="100%" aria-hidden className={styles.icon} />
                </Column>
                <Column size={9}>
                  <ul className={styles.ul}>
                    {entries.map((entry, index) => (
                      <li className={styles.li} key={index}>
                        {entry}
                      </li>
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
