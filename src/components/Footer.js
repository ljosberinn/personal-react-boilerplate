import React from 'react';
import { Footer as RBXFooter, Container, Column, Generic } from 'rbx';
import { NavLink } from 'react-router-dom';
import ExternalLink from './ExternalLink';
import LanguageSwitch from './LanguageSwitch';
import Icon from './Icon';
import ThemeSwitch from './ThemeSwitch';
import * as ROUTES from '../constants/routes';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';
import env from '../constants/env';

/**
 *
 * @returns {React.FC<{
 * children: React.ReactChildren
 * }>} Link
 */
function Link({ children, ...rest }) {
  return (
    <NavLink activeClassName="is-active" {...rest}>
      {children}
    </NavLink>
  );
}

/**
 * @returns {React.FC} Footer
 */
export default function Footer() {
  const { isLoggedIn, isConfirmedUser } = useIdentityContext();
  const { t } = useTranslation(['footer', 'routes', 'navigation']);

  return (
    <RBXFooter as="footer">
      <Container>
        <Column.Group>
          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                {env.BRAND_NAME}
              </Generic>
              <li>
                <InternalLink route={ROUTES.LANDING_PAGE} t={t} />
              </li>
              {!isLoggedIn || !isConfirmedUser ? (
                <>
                  <li>
                    <InternalLink route={ROUTES.REGISTER} t={t} />
                  </li>
                  <li>
                    <InternalLink route={ROUTES.LOGIN} t={t} />
                  </li>
                  <li>
                    <InternalLink route={ROUTES.RESET_PASSWORD} t={t} />
                  </li>
                </>
              ) : (
                <li>
                  <InternalLink route={ROUTES.SETTINGS} t={t} />
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
                <InternalLink route={ROUTES.TOS} t={t} />
              </li>
              <li>
                <InternalLink route={ROUTES.PRIVACY_POLICY} t={t} />
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
                <LanguageSwitch from="footer" />
              </li>

              {env.DISCORD_LINK && (
                <li>
                  <ExternalLink href={env.DISCORD_LINK}>
                    <Icon icon={faDiscord} />
                    <span>Discord</span>
                  </ExternalLink>
                </li>
              )}

              {env.REPO_LINK && (
                <li>
                  <ExternalLink href={env.REPO_LINK}>
                    <Icon icon={faGithub} />
                    <span>{t('navigation:contribute')}</span>
                  </ExternalLink>
                </li>
              )}
            </ul>
          </Column>
        </Column.Group>
      </Container>
    </RBXFooter>
  );
}

/**
 *
 * @returns {React.FC<{
 * route: typeof ROUTES[number],
 * t: import('i18next').TFunction
 * }} InternalLink
 */
function InternalLink({ route: { clientPath, icon, title }, t }) {
  return (
    <Link to={clientPath}>
      {icon ? (
        <>
          <Icon icon={icon} />
          <span>{t(title)}</span>
        </>
      ) : (
        t(title)
      )}
    </Link>
  );
}
