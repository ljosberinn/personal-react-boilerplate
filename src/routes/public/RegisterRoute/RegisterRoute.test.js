import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render, fireEvent } from '../../../utils/testUtils';

import RegisterRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const validMail = 'some@mail.com';
const invalidMail = 'foo';

const validPassword = 'a1234567';
const invalidPassword = '12345678';

describe('<RegisterRoute />', () => {
  test('renders successfully', () => {
    render(<RegisterRoute />);
  });

  test('disallows registration if passwords dont match', () => {
    const { getByTestId } = render(<RegisterRoute />);

    const mailInput = getByTestId('mail');
    const tosCheckbox = getByTestId('tos');
    const passwordInput = getByTestId('password');
    const confirmPasswordInput = getByTestId('confirm-password');
    const submitButton = getByTestId('sign-up');

    // setup
    fireEvent.input(mailInput, { target: { value: validMail } });
    fireEvent.input(tosCheckbox, { target: { checked: true } });

    expect(submitButton.disabled).toBeTruthy();
    expect(confirmPasswordInput.disabled).toBeTruthy();

    // Password
    fireEvent.input(passwordInput, { target: { value: validPassword } });
    fireEvent.input(confirmPasswordInput, {
      target: { value: invalidPassword },
    });

    expect(confirmPasswordInput.classList.contains('is-danger')).toBeTruthy();
    expect(submitButton.disabled).toBeTruthy();
  });

  [
    {
      description: 'can be submitted with valid data',
      mail: {
        value: validMail,
        iconSuccess: true,
      },
      password: {
        value: validPassword,
        iconSuccess: true,
      },
      confirmPassword: {
        value: validPassword,
        iconSuccess: true,
      },
      tos: {
        checked: true,
      },
      buttonDisabled: false,
    },
    {
      description: 'cant be submitted with invalid mail',
      mail: {
        value: invalidMail,
        iconSuccess: false,
      },
      password: {
        value: validPassword,
        iconSuccess: true,
      },
      confirmPassword: {
        value: validPassword,
        iconSuccess: true,
      },
      tos: {
        checked: true,
      },
      buttonDisabled: true,
    },
    {
      description: 'cant be submitted with invalid password',
      mail: {
        value: validMail,
        iconSuccess: true,
      },
      password: {
        value: invalidPassword,
        iconSuccess: false,
      },
      confirmPassword: {
        value: invalidPassword,
        iconSuccess: false,
      },
      tos: {
        checked: true,
      },
      buttonDisabled: true,
    },
    {
      description: 'cant be submitted without checking ToS',
      mail: {
        value: validMail,
        iconSuccess: true,
      },
      password: {
        value: validPassword,
        iconSuccess: true,
      },
      confirmPassword: {
        value: validPassword,
        iconSuccess: true,
      },
      tos: {
        checked: false,
      },
      buttonDisabled: true,
    },
  ].forEach(
    ({ description, mail, password, confirmPassword, buttonDisabled, tos }) => {
      it(description, () => {
        const { getByTestId } = render(<RegisterRoute />);

        const mailInput = getByTestId('mail');
        const passwordInput = getByTestId('password');
        const confirmPasswordInput = getByTestId('confirm-password');
        const tosCheckbox = getByTestId('tos');
        const submitButton = getByTestId('sign-up');

        expect(submitButton.disabled).toBeTruthy();
        expect(confirmPasswordInput.disabled).toBeTruthy();

        // Mail
        fireEvent.input(mailInput, { target: { value: mail.value } });

        expect(submitButton.disabled).toBeTruthy();
        expect(confirmPasswordInput.disabled).toBeTruthy();
        expect(
          mailInput.nextElementSibling.classList.contains('has-text-success'),
        ).toBe(mail.iconSuccess);

        // Password
        fireEvent.input(passwordInput, { target: { value: password.value } });

        expect(submitButton.disabled).toBeTruthy();
        expect(confirmPasswordInput.disabled).toBe(
          password.value !== validPassword,
        );
        expect(
          passwordInput.nextElementSibling.classList.contains(
            'has-text-success',
          ),
        ).toBe(password.iconSuccess);

        // Confirm password
        fireEvent.input(confirmPasswordInput, {
          target: { value: confirmPassword.value },
        });

        expect(confirmPasswordInput.disabled).toBe(
          confirmPassword.value !== validPassword,
        );
        expect(
          confirmPasswordInput.nextElementSibling.classList.contains(
            'has-text-success',
          ),
        ).toBe(confirmPassword.iconSuccess);

        expect(submitButton.disabled).toBeTruthy();

        // ToS checkbox
        if (tos.checked) {
          fireEvent.click(tosCheckbox);
        }

        expect(tosCheckbox.checked).toBe(tos.checked);
        expect(submitButton.disabled).toBe(buttonDisabled);
      });
    },
  );
});
