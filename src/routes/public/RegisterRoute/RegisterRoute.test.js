import React from 'react';
import RegisterRoute from '.';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

const validMail = 'some@mail.com';
const invalidMail = 'foo';

const validPassword = 'a1234567';
const invalidPassword = '12345678';

afterEach(cleanup);

describe('<RegisterRoute />', () => {
  it('renders successfully', () => {
    render(
      <Router history={history}>
        <RegisterRoute />
      </Router>,
    );
  });

  it('renders an error when passwords do not match', () => {
    const { getByLabelText, getByText } = render(
      <Router history={history}>
        <RegisterRoute />
      </Router>,
    );

    const passwordInput = getByLabelText('Password');
    const confirmPasswordInput = getByLabelText('Confirm password');
    const submitButton = getByText('Sign up', { selector: 'button' });

    expect(submitButton.disabled).toBe(true);
    expect(confirmPasswordInput.disabled).toBe(true);

    // Password
    act(() => {
      fireEvent.input(passwordInput, { target: { value: validPassword } });
      fireEvent.input(confirmPasswordInput, {
        target: { value: invalidPassword },
      });
    });

    expect(confirmPasswordInput.classList.contains('is-danger')).toBe(true);
    expect(getByText('Passwords do not match.')).toBeTruthy();
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
        const { getByLabelText, getByText } = render(
          <Router history={history}>
            <RegisterRoute />
          </Router>,
        );

        const mailInput = getByLabelText('Email address');
        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm password');
        const tosCheckbox = getByLabelText('I agree to the Terms of Service.');
        const submitButton = getByText('Sign up', { selector: 'button' });

        expect(submitButton.disabled).toBe(true);
        expect(confirmPasswordInput.disabled).toBe(true);

        // Mail
        act(() => {
          fireEvent.input(mailInput, { target: { value: mail.value } });
        });

        expect(submitButton.disabled).toBe(true);
        expect(confirmPasswordInput.disabled).toBe(true);
        expect(
          mailInput.nextElementSibling.classList.contains('has-text-success'),
        ).toBe(mail.iconSuccess);

        // Password
        act(() => {
          fireEvent.input(passwordInput, { target: { value: password.value } });
        });

        expect(submitButton.disabled).toBe(true);
        expect(confirmPasswordInput.disabled).toBe(
          password.value !== validPassword,
        );
        expect(
          passwordInput.nextElementSibling.classList.contains(
            'has-text-success',
          ),
        ).toBe(password.iconSuccess);

        // Confirm password
        act(() => {
          fireEvent.input(confirmPasswordInput, {
            target: { value: password.value },
          });
        });

        expect(confirmPasswordInput.disabled).toBe(
          password.value !== validPassword,
        );
        expect(submitButton.disabled).toBe(true);

        // ToS checkbox
        if (tos.checked) {
          act(() => {
            fireEvent.click(tosCheckbox);
          });
        }

        expect(tosCheckbox.checked).toBe(tos.checked);

        expect(submitButton.disabled).toBe(buttonDisabled);
        expect(
          confirmPasswordInput.nextElementSibling.classList.contains(
            'has-text-success',
          ),
        ).toBe(confirmPassword.iconSuccess);
      });
    },
  );
});
