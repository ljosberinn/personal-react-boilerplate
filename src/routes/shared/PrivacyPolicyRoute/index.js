import classnames from 'classnames';
import PropTypes from 'prop-types';
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
import { withSentry } from '../../../hocs';
import styles from './PrivacyPolicy.module.scss';

const content = [
  {
    element: 'analytics',
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
    element: 'thirdParty',
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
    element: 'cookies',
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
    element: 'ads',
    entries: [
      { id: 1, placeholder: '' },
      { id: 2, placeholder: '' },
    ],
    icon: AdSvg,
  },
];

export default withSentry(function PrivacyPolicy() {
  const { t } = useTranslation(['routes', 'privacyPolicy']);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('privacyPolicy')}</title>
      </TemplatedHelmet>

      <Section className={styles.background} aria-labelledby="section-title">
        <Fade triggerOnce>
          <Title id="section-title">{t('privacyPolicy')}</Title>
        </Fade>
        <div>
          {content.map((dataset, index) => (
            <Slide {...dataset} index={index} t={t} key={index} />
          ))}
        </div>
      </Section>
    </>
  );
});

/**
 *
 * @param {{
 * element: string;
 * entries: { id: number, placeholder: string | JSX.Element }[];
 * icon: import('react-icons').IconType;
 * t: import('i18next').TFunction;
 * index: number;
 * }}
 */
function Slide({ element, icon: Icon, entries, index, t }) {
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
      <Box className={styles.box} as="article">
        <Card className={styles.card}>
          <Card.Header className={styles.cardHeader}>
            <Card.Header.Title as="h2">
              {t(`privacyPolicy:${element}Title`)}
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
                    {entries.map(({ id, placeholder }) => (
                      <Trans
                        i18nKey={`${element}${id}`}
                        ns="privacyPolicy"
                        parent="li"
                        className={styles.li}
                        key={id}
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

Slide.propTypes = {
  element: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    }),
  ).isRequired,
  icon: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
