import { useIdentityContext } from 'react-netlify-identity';

import i18n from 'i18next';
import { Column, Content, Title, Section, Card, Generic } from 'rbx';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { TemplatedHelmet, Form } from '../../../components';
import * as ROUTES from '../../../constants/routes';
import { useTheme } from '../../../hooks';
import RedirectToHome from '../../RedirectToHome';

import styles from './Register.module.scss';
import RegistrationForm from './RegistrationForm';
import RegistrationSuccess from './RegistrationSuccess';

const errors = {
  mailInUse: 'mailInUse',
};

export default function RegisterRoute() {
  const { signupUser, isLoggedIn, isConfirmedUser } = useIdentityContext();
  const { theme } = useTheme();

  const [data, setData] = useState({
    mail: '',
    password: '',
    confirmPassword: '',
    tos: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);
  const { t } = useTranslation(['registration', 'routes', 'login', 'error']);

  const handleChange = useCallback(
    ({ target: { name, type, value } }) => {
      if (error) {
        setError(null);
      }

      switch (type) {
        case 'checkbox':
          setData(data => ({ ...data, [name]: !data[name] }));
          break;
        default:
          setData(data => ({ ...data, [name]: value }));
          break;
      }
    },
    [error],
  );

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      setIsLoading(true);

      try {
        await signupUser(
          data.mail,
          data.password,
          {
            language: i18n.language,
            theme,
          },
          false,
        );
        setSuccessfullyRegistered(true);
      } catch (error) {
        console.error(error);

        if (
          error?.json?.msg ===
          'A user with this email address has already been registered'
        ) {
          setError(errors.mailInUse);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [signupUser, data.mail, data.password, theme],
  );

  if (isLoggedIn && isConfirmedUser) {
    return <RedirectToHome />;
  }

  return (
    <>
      <TemplatedHelmet>
        <title>{t('routes:register')}</title>
      </TemplatedHelmet>
      <Section
        className={`has-background-svg ${styles.container}`}
        aria-labelledby="section-title"
      >
        <Column.Group centered>
          <Column widescreen={{ size: 5 }} tablet={{ size: 8 }}>
            <Card>
              <Card.Content>
                <Form onSubmit={handleSubmit}>
                  <Column.Group centered>
                    <Column
                      className="has-content-spaced-between"
                      widescreen={{ size: 11 }}
                    >
                      <legend>
                        <Title textAlign="centered" id="section-title">
                          {successfullyRegistered
                            ? t('verifyMail')
                            : t('createYourAccount')}
                        </Title>
                      </legend>

                      <br />

                      <Column.Group centered>
                        <Column size={11}>
                          <Content>
                            {successfullyRegistered ? (
                              <RegistrationSuccess mail={data.mail} />
                            ) : (
                              <RegistrationForm
                                {...{
                                  handleChange,
                                  error,
                                  isLoading,
                                  t,
                                  ...data,
                                }}
                              />
                            )}
                          </Content>
                        </Column>
                      </Column.Group>

                      {!successfullyRegistered && (
                        <Generic textAlign="centered">
                          {t('alreadyHaveAnAccount')}{' '}
                          <Link to={ROUTES.LOGIN.clientPath}>
                            {t('login:signIn')}
                          </Link>
                        </Generic>
                      )}
                    </Column>
                  </Column.Group>
                </Form>
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
