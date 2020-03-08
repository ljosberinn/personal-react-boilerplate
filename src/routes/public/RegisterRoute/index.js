import i18n from 'i18next';
import { Column, Content, Title, Section, Card, Generic } from 'rbx';
import React, { useState, useCallback, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';

import { TemplatedHelmet, Form } from '../../../components';
import { useNavigationContext, useTheme } from '../../../context';
import { withSentry } from '../../../hocs';
import styles from './Register.module.scss';
import RegistrationForm from './RegistrationForm';

const RedirectToHome = lazy(() =>
  import(/* webpackChunkName: "redirect_to_home" */ '../../RedirectToHome'),
);

const RegistrationSuccess = lazy(() =>
  import(
    /* webpackChunkName: "public.registration.success" */ './RegistrationSuccess'
  ),
);

const errors = {
  mailInUse: 'mailInUse',
};

export default withSentry(function RegisterRoute() {
  const { signupUser, isLoggedIn, isConfirmedUser } = useIdentityContext();
  const { theme } = useTheme();
  const {
    routes: { LOGIN },
    PreloadingLink,
  } = useNavigationContext();

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

  function handleSubmit(event) {
    event.preventDefault();

    if (error) {
      setError(null);
    }

    setIsLoading(true);

    signupUser(
      data.mail,
      data.password,
      {
        language: i18n.language,
        theme,
      },
      false,
    )
      .then(() => setSuccessfullyRegistered(true))
      .catch(error => {
        console.error(error);

        if (
          error?.json?.msg ===
          'A user with this email address has already been registered'
        ) {
          setError(errors.mailInUse);
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoggedIn && isConfirmedUser) {
    return <RedirectToHome />;
  }

  return (
    <>
      <TemplatedHelmet>
        <title>{t('routes:register')}</title>
      </TemplatedHelmet>
      <Section className={styles.container} aria-labelledby="section-title">
        <Column.Group centered className={styles.parent}>
          <Column widescreen={{ size: 6 }} tablet={{ size: 8 }}>
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
                          <PreloadingLink to={LOGIN}>
                            {t('login:signIn')}
                          </PreloadingLink>
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
});
