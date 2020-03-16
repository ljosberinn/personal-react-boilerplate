import { Footer as RBXFooter, Container, Column, Generic } from 'rbx';
import React, { memo, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';
import { NavLink } from 'react-router-dom';

import { ReactComponent as LogoIpsumSvg } from '../../assets/svg/logoIpsum.svg';
import { BRAND_NAME } from '../../constants/env';
import { useNavigationContext } from '../../context';
import withSuspense from '../../hocs/withSuspense';
import DiscordLink from '../DiscordLink';
import ExternalLink from '../ExternalLink';
import GithubLink from '../GithubLink';
import Icon from '../Icon';
import LanguageSwitch from '../LanguageSwitch';
import ThemeSwitch from '../ThemeSwitch';
import styles from './Footer.module.scss';

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

export default memo(
  withSuspense(function Footer(props) {
    const { isLoggedIn, isConfirmedUser } = useIdentityContext();
    const { t } = useTranslation(['footer', 'routes', 'navigation']);
    const {
      routes: { LANDING_PAGE, TOS, PRIVACY_POLICY },
      PreloadingLink,
    } = useNavigationContext();

    const authAwareLinks =
      !isLoggedIn || !isConfirmedUser ? (
        <UnauthenticatedLinks />
      ) : (
        <AuthenticatedLinks />
      );

    return (
      <RBXFooter as="footer" className={styles.footer} {...props}>
        <Container as="nav" aria-label="meta navigation">
          <Column.Group>
            <Column size={5} widescreen={{ size: 4 }}>
              <PreloadingLink as={NavLink} className="brand" to={LANDING_PAGE}>
                <div className="brand-icon">
                  <LogoIpsumSvg aria-label={BRAND_NAME} />
                </div>
              </PreloadingLink>
              <p className={styles.paragraph}>
                The personal React boilerplate of{' '}
                <ExternalLink href="//github.com/ljosberinn">
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
                      <PreloadingLink as={NavLink} to={LANDING_PAGE}>
                        {t(LANDING_PAGE.title)}
                      </PreloadingLink>
                    </li>
                    {authAwareLinks}
                  </ul>
                </Column>

                <Column size={4}>
                  <ul>
                    <Generic as="li" textWeight="semibold">
                      {t('legal')}
                    </Generic>
                    <li>
                      <PreloadingLink as={NavLink} to={TOS}>
                        <Icon svg={TOS.icon} />
                        <span>{t(TOS.title)}</span>
                      </PreloadingLink>
                    </li>
                    <li>
                      <PreloadingLink as={NavLink} to={PRIVACY_POLICY}>
                        <Icon svg={PRIVACY_POLICY.icon} />
                        <span>{t(PRIVACY_POLICY.title)}</span>
                      </PreloadingLink>
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
                    <DiscordLink from="footer" />
                    <GithubLink from="footer" />
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
