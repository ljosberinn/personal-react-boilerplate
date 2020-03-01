import { Footer as RBXFooter, Container, Column, Generic } from 'rbx';
import React, { memo, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';
import { NavLink } from 'react-router-dom';

import { ReactComponent as LogoIpsumSvg } from '../../assets/svg/logoIpsum.svg';
import { REPO_LINK, DISCORD_LINK, BRAND_NAME } from '../../constants/env';
import withSuspense from '../../hocs/withSuspense';
import { LANDING_PAGE, TOS, PRIVACY_POLICY } from '../../routes/config';
import ExternalLink from '../ExternalLink';
import Icon from '../Icon';
import LanguageSwitch from '../LanguageSwitch';
import ThemeSwitch from '../ThemeSwitch';
import styles from './Footer.module.scss';
import InternalLink from './InternalLink';

const UnauthenticatedLinks = lazy(() =>
  import(
    /* webpackChunkName: "footer.unauthenticated_links" */ './UnauthenticatedLinks'
  ),
);
const AuthenticatedLinks = lazy(() =>
  import(
    /* webpackChunkName: "footer.authenticated_links" */ './AuthenticatedLinks'
  ),
);

export default withSuspense(
  memo(function Footer() {
    const { isLoggedIn, isConfirmedUser } = useIdentityContext();
    const { t } = useTranslation(['footer', 'routes', 'navigation']);

    return (
      <RBXFooter as="footer" className={styles.footer}>
        <Container as="nav" aria-label="meta navigation">
          <Column.Group>
            <Column size={5} widescreen={{ size: 4 }}>
              <NavLink className="brand" to={LANDING_PAGE.clientPath}>
                <div className="brand-icon">
                  <LogoIpsumSvg aria-label={BRAND_NAME} />
                </div>
              </NavLink>
              <p className={styles.paragraph}>
                The personal React boilerplate of{' '}
                <ExternalLink href={REPO_LINK}>
                  Gerrit Alex / ljosberinn
                </ExternalLink>
              </p>
              <p className={styles.paragraph}>MIT Gerrit Alex</p>
            </Column>
            <Column size={7} widescreen={{ size: 6, offset: 2 }}>
              <Column.Group>
                <Column size={4}>
                  <ul>
                    <Generic as="li" textWeight="semibold">
                      {BRAND_NAME}
                    </Generic>
                    <li>
                      <InternalLink route={LANDING_PAGE} t={t} />
                    </li>
                    {!isLoggedIn || !isConfirmedUser ? (
                      <UnauthenticatedLinks t={t} />
                    ) : (
                      <AuthenticatedLinks t={t} />
                    )}
                  </ul>
                </Column>

                <Column size={4}>
                  <ul>
                    <Generic as="li" textWeight="semibold">
                      {t('legal')}
                    </Generic>
                    <li>
                      <InternalLink route={TOS} t={t} />
                    </li>
                    <li>
                      <InternalLink route={PRIVACY_POLICY} t={t} />
                    </li>
                  </ul>
                </Column>

                <Column size={4}>
                  <ul>
                    <Generic as="li" textWeight="semibold">
                      {t('other')}
                    </Generic>
                    <li>
                      <ThemeSwitch from="footer" />
                    </li>

                    <li>
                      <LanguageSwitch from="footer" />
                    </li>

                    {DISCORD_LINK && (
                      <li>
                        <ExternalLink href={DISCORD_LINK}>
                          <Icon svg={FaDiscord} />
                          <span>Discord</span>
                        </ExternalLink>
                      </li>
                    )}

                    {REPO_LINK && (
                      <li>
                        <ExternalLink href={REPO_LINK}>
                          <Icon svg={FaGithub} />
                          <span>{t('navigation:contribute')}</span>
                        </ExternalLink>
                      </li>
                    )}
                  </ul>
                </Column>
              </Column.Group>
            </Column>
          </Column.Group>
        </Container>
      </RBXFooter>
    );
  }),
);
