import { fireEvent } from '@testing-library/react';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Route } from 'react-router-dom';

import { render } from '../../../utils/testUtils';

import LoginRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const path = '/login/:mail?';

const validMail = 'some@mail.com';
const invalidMail = 'foo';

const validPassword = 'a1234567';
const invalidPassword = '12345678';

describe('<LoginRoute />', () => {
  test('renders successfully', () => {
    render(<LoginRoute />);
  });

  test('renders successfully with optional valid mail', () => {
    const { getByTestId, history } = render(
      <Route path={path} component={LoginRoute} />,
    );

    history.push(`/login/${validMail}`);

    const mailInput = getByTestId('mail');

    expect(mailInput.value).toBe(validMail);
    expect(
      mailInput.nextElementSibling.classList.contains('has-text-success'),
    ).toBeTruthy();

    const passwordInput = getByTestId('password');
    expect(document.activeElement).toEqual(passwordInput);
  });

  test('renders successfully with optional invalid mail', () => {
    const { getByTestId, history } = render(
      <Route path={path} component={LoginRoute} />,
    );

    history.push(`/login/${invalidMail}`);

    const mailInput = getByTestId('mail');

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
  ].forEach(({ description, password, mail, buttonDisabled }) => {
    test(description, () => {
      const { getByTestId } = render(<LoginRoute />);

      const mailInput = getByTestId('mail');
      const passwordInput = getByTestId('password');
      const submitButton = getByTestId('sign-in');

      expect(submitButton.disabled).toBeTruthy();

      fireEvent.input(mailInput, { target: { value: mail.value } });

      expect(submitButton.disabled).toBeTruthy();
      expect(
        mailInput.nextElementSibling.classList.contains('has-text-success'),
      ).toBe(mail.iconSuccess);

      fireEvent.input(passwordInput, { target: { value: password.value } });

      expect(
        passwordInput.nextElementSibling.classList.contains('has-text-success'),
      ).toBe(password.iconSuccess);

      expect(submitButton.disabled).toBe(buttonDisabled);
    });
  });
});
