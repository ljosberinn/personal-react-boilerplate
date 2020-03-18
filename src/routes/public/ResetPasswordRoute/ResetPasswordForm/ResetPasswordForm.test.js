import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../../../__mocks__/react-netlify-identity';
import { render } from '../../../../utils/testUtils';

import ResetPasswordForm from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  IdentityContextProvider.mockImplementation(mockIdentityContextProvider);

  useIdentityContext.mockReturnValue({
    requestPasswordRecovery: mail => Promise.resolve(),
  });
});

describe('<ResetPasswordForm />', () => {
  it('renders without crashing', () => {
    render(<ResetPasswordForm />);
  });

  it('should always show a success message after submitting with a valid mail', async () => {
    const { getByTestId } = render(<ResetPasswordForm />);

    const mailInput = getByTestId('mail-input');
    const submitButton = getByTestId('submit-button');

    expect(submitButton.disabled).toBe(true);

    fireEvent.input(mailInput, {
      target: {
        value: 'some@mail.com',
      },
    });

    expect(submitButton.disabled).toBe(false);

    fireEvent.click(submitButton);

    await waitFor(() => getByTestId('success-message') !== null);

    [mailInput, submitButton].forEach(element => {
      expect(element).not.toBeInTheDocument();
    });
  });
});
