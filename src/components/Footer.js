import React from 'react';
import { Footer as RBXFooter, Container, Column, Generic } from 'rbx';
import { NavLink } from 'react-router-dom';
import { ExternalLink, LanguageSwitch, Icon } from '.';
import * as ROUTES from '../constants/routes';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';

const brandName = 'Brand Name';

const FooterData = [
  {
    title: brandName,
    elements: [
      { to: '/', content: 'Home' },

      {
        to: ROUTES.REGISTER,
        content: 'Register',
      },
      { to: '/login', content: 'Login' },
      { to: ROUTES.RESET_PASSWORD, content: 'Forgot password?' },
    ],
  },
  {
    title: 'Features',
    elements: [],
  },
  {
    title: 'Legal',
    elements: [
      { to: ROUTES.TOS, content: 'Terms of Service' },
      { to: ROUTES.PRIVACY_POLICY, content: 'Privacy policy' },
    ],
  },
  {
    title: 'Links',
    elements: [
      {
        to: undefined,
        content: <LanguageSwitch footer />,
      },
      {
        to: '//discord.gg',
        content: (
          <>
            <Icon icon={faDiscord} /> <span>Discord</span>
          </>
        ),
      },
      {
        to: '//github.com/ljosberinn/current-react-playground',
        content: (
          <>
            <Icon icon={faGithub} /> <span>GitHub</span>
          </>
        ),
      },
    ],
  },
];
export default function Footer() {
  return (
    <RBXFooter as="footer">
      <Container>
        <Column.Group>
          {FooterData.map(({ title, elements }) => (
            <Column size={12 / FooterData.length} key={title}>
              <ul>
                <Generic as="li" textWeight="semibold">
                  {title}
                </Generic>
                {elements.map(({ to, content }, index) => (
                  <li key={index}>
                    {!to ? (
                      content
                    ) : to.startsWith('//') ? (
                      <ExternalLink href={to}>{content}</ExternalLink>
                    ) : (
                      <NavLink to={to} activeClassName="is-active">
                        {content}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </Column>
          ))}
        </Column.Group>
      </Container>
    </RBXFooter>
  );
}
