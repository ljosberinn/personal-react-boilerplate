import React, { useContext, Suspense } from 'react';
import { Footer as RBXFooter, Container, Column, Generic } from 'rbx';
import { NavLink } from 'react-router-dom';
import ExternalLink from './ExternalLink';
import LanguageSwitch from './LanguageSwitch';
import Loader from './Loader';
import Icon from './Icon';
import ThemeSwitch from './ThemeSwitch';
import * as ROUTES from '../constants/routes';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

function Link({ children, ...rest }) {
  return (
    <NavLink activeClassName="is-active" {...rest}>
      {children}
    </NavLink>
  );
}

export default function Footer() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation(['footer', 'routes']);

  return (
    <RBXFooter as="footer">
      <Container>
        <Column.Group>
          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                {process.env.REACT_APP_BRAND_NAME}
              </Generic>
              <li>
                <Link to="/">{t(ROUTES.LANDING_PAGE.title)}</Link>
              </li>
              {!user ? (
                <>
                  <li>
                    <Link to={ROUTES.REGISTER.normalizedPath}>
                      <Icon icon={ROUTES.REGISTER.icon} />
                      <span>{t(ROUTES.REGISTER.title)}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.LOGIN.normalizedPath}>
                      <Icon icon={ROUTES.LOGIN.icon} />
                      <span>{t(ROUTES.LOGIN.title)}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.RESET_PASSWORD.normalizedPath}>
                      {t(ROUTES.RESET_PASSWORD.title)}
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to={ROUTES.SETTINGS.normalizedPath}>
                    <Icon icon={ROUTES.SETTINGS.icon} />
                    <span>{t(ROUTES.SETTINGS.title)}</span>
                  </Link>
                </li>
              )}
            </ul>
          </Column>
          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                {t('features')}
              </Generic>
            </ul>
          </Column>

          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                {t('legal')}
              </Generic>
              <li>
                <Link to={ROUTES.TOS.normalizedPath}>
                  <Icon icon={ROUTES.TOS.icon} />
                  <span>{t(ROUTES.TOS.title)}</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRIVACY_POLICY.normalizedPath}>
                  <Icon icon={ROUTES.PRIVACY_POLICY.icon} />
                  <span>{t(ROUTES.PRIVACY_POLICY.title)}</span>
                </Link>
              </li>
            </ul>
          </Column>

          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                {t('other')}
              </Generic>
              <li>
                <ThemeSwitch from="footer" />
              </li>

              <li>
                <Suspense fallback={<Loader />}>
                  <LanguageSwitch from="footer" />
                </Suspense>
              </li>
              <li>
                <ExternalLink href="//discord.gg">
                  <Icon icon={faDiscord} />
                  <span>Discord</span>
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href="//github.com/ljosberinn/current-react-playground">
                  <Icon icon={faGithub} />
                  <span>Contribute</span>
                </ExternalLink>
              </li>
            </ul>
          </Column>
        </Column.Group>
      </Container>
    </RBXFooter>
  );
}
