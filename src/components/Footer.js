import React, { useContext } from 'react';
import { Footer as RBXFooter, Container, Column, Generic } from 'rbx';
import { NavLink } from 'react-router-dom';
import ExternalLink from './ExternalLink';
import LanguageSwitch from './LanguageSwitch';
import Icon from './Icon';
import ThemeSwitch from './ThemeSwitch';
import * as ROUTES from '../constants/routes';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from '../context/AuthContext';

export default function Footer() {
  const { user } = useContext(AuthContext);

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
                <NavLink to="/" activeClassName="is-active">
                  Home
                </NavLink>
              </li>
              {!user ? (
                <>
                  <li>
                    <NavLink
                      to={ROUTES.REGISTER.routerPath}
                      activeClassName="is-active"
                    >
                      {ROUTES.REGISTER.title}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" activeClassName="is-active">
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={ROUTES.RESET_PASSWORD.routerPath}
                      activeClassName="is-active"
                    >
                      {ROUTES.RESET_PASSWORD.title}
                    </NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to={ROUTES.SETTINGS.routerPath}
                    activeClassName="is-active"
                  >
                    <Icon icon={ROUTES.SETTINGS.icon} />
                    <span>{ROUTES.SETTINGS.title}</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </Column>
          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                Features
              </Generic>
            </ul>
          </Column>

          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                Legal
              </Generic>
              <li>
                <NavLink
                  to={ROUTES.TOS.normalizedPath}
                  activeClassName="is-active"
                >
                  {ROUTES.TOS.title}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={ROUTES.PRIVACY_POLICY.normalizedPath}
                  activeClassName="is-active"
                >
                  {ROUTES.PRIVACY_POLICY.title}
                </NavLink>
              </li>
            </ul>
          </Column>

          <Column size={3}>
            <ul>
              <Generic as="li" textWeight="semibold">
                Other
              </Generic>
              <li>
                <ThemeSwitch from="footer" />
              </li>

              <li>
                <LanguageSwitch footer />
              </li>
              <li>
                <ExternalLink href="//discord.gg">
                  <Icon icon={faDiscord} /> <span>Discord</span>
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href="//github.com/ljosberinn/current-react-playground">
                  <Icon icon={faGithub} /> <span>Contribute</span>
                </ExternalLink>
              </li>
            </ul>
          </Column>
        </Column.Group>
      </Container>
    </RBXFooter>
  );
}
