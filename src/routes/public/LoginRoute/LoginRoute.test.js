import React from 'react';
import LoginRoute from '.';
import { render, cleanup, fireEvent, wait } from '@testing-library/react';
import { Router, Route } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

const validMail = 'some@mail.com';
const invalidMail = 'foo';

const validPassword = 'a1234567';
const invalidPassword = '12345678';

afterEach(cleanup);

describe('<LoginRoute />', () => {
  it('renders successfully', () => {
    render(
      <Router history={history}>
        <LoginRoute />
      </Router>,
    );
  });

  it('renders successfully with optional valid mail', () => {
    history.push(`/login/${validMail}`);

    const { getByLabelText } = render(
      <Router history={history}>
        <Route path={ROUTES.LOGIN} component={LoginRoute} />
      </Router>,
    );

    const mailInput = getByLabelText('Email address');

    expect(mailInput.value).toBe(validMail);
    expect(
      mailInput.nextElementSibling.classList.contains('has-text-success'),
    ).toBe(true);

    const passwordInput = getByLabelText('Password');
    expect(document.activeElement).toEqual(passwordInput);
  });

  it('renders successfully with optional invalid mail', () => {
    history.push(`/login/${invalidMail}`);

    const { getByLabelText } = render(
      <Router history={history}>
        <LoginRoute />
      </Router>,
    );

    const mailInput = getByLabelText('Email address');

    expect(mailInput.value).toBe('');
    expect(document.activeElement).toEqual(mailInput);
  });

  [
    {
      description: 'can be submitted with valid mail & password',
      mail: {
        value: validMail,
        iconSuccess: true,
      },
      password: {
        value: validPassword,
        iconSuccess: true,
      },
      buttonDisabled: false,
    },
    {
      description: 'cant be submitted with invalid mail & valid password',
      mail: {
        value: invalidMail,
        iconSuccess: false,
      },
      password: {
        value: validPassword,
        iconSuccess: true,
      },
      buttonDisabled: true,
    },
    {
      description: 'cant be submitted with valid mail & invalid password',
      mail: {
        value: validMail,
        iconSuccess: true,
      },
      password: {
        value: invalidPassword,
        iconSuccess: false,
      },
      buttonDisabled: true,
    },
  ].map(({ description, password, mail, buttonDisabled }) => {
    it(description, () => {
      const { getByLabelText, getByText } = render(
        <Router history={history}>
          <LoginRoute />
        </Router>,
      );

      const mailInput = getByLabelText('Email address');
      const passwordInput = getByLabelText('Password');
      const submitButton = getByText('Sign in', { selector: 'button' });

      expect(submitButton.disabled).toBe(true);

      fireEvent.input(mailInput, { target: { value: mail.value } });
      expect(submitButton.disabled).toBe(true);

      fireEvent.input(passwordInput, { target: { value: password.value } });

      expect(
        mailInput.nextElementSibling.classList.contains('has-text-success'),
      ).toBe(mail.iconSuccess);
      expect(
        passwordInput.nextElementSibling.classList.contains('has-text-success'),
      ).toBe(password.iconSuccess);

      expect(submitButton.disabled).toBe(buttonDisabled);
    });
  });
});
