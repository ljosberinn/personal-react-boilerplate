import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TemplatedHelmet, Form } from '../../../components';
import { Column, Content, Title, Section, Card } from 'rbx';
import * as ROUTES from '../../../constants/routes';
import RedirectToHome from '../../RedirectToHome';
import { useIdentityContext } from 'react-netlify-identity';
import { useTranslation } from 'react-i18next';
import RegistrationSuccess from './RegistrationSuccess';
import RegistrationForm from './RegistrationForm';

/**
 * @returns {React.FC} RegisterRoute
 */
export default function RegisterRoute() {
  const { signupUser, isLoggedIn, isConfirmedUser } = useIdentityContext();

  const [data, setData] = useState({
    mail: '',
    password: '',
    confirmPassword: '',
    tos: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);
  const { t } = useTranslation(['registration', 'routes', 'login']);

  const handleChange = useCallback(({ target: { name, type, value } }) => {
    switch (type) {
      case 'checkbox':
        setData(data => ({ ...data, [name]: !data[name] }));
        break;
      default:
        setData(data => ({ ...data, [name]: value }));
        break;
    }
  }, []);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      setIsLoading(true);

      try {
        await signupUser(data.mail, data.password);
        setSuccessfullyRegistered(true);
      } catch (error) {
        console.error(error);

        if (
          error?.json?.msg ===
          'A user with this email address has already been registered'
        ) {
          setError('mail-in-use');
        }

        setIsLoading(false);
      }
    },
    [signupUser, data.mail, data.password],
  );

  if (isLoggedIn && isConfirmedUser) {
    return <RedirectToHome />;
  }

  return (
    <>
      <TemplatedHelmet>
        <title>{t('routes:register')}</title>
      </TemplatedHelmet>
      <Section className="register-bg">
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
                        <Title textAlign="centered">
                          {successfullyRegistered
                            ? t('verify-mail')
                            : t('create-your-account')}
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
                        <p className="has-text-centered has-text-grey">
                          {t('already-have-an-account')}{' '}
                          <Link to={ROUTES.LOGIN.clientPath}>
                            {t('login:sign-in')}
                          </Link>
                        </p>
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
