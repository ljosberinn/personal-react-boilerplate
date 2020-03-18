//import { fireEvent, waitFor } from '@testing-library/react';
//import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';

//import { LOGIN, RESET_PASSWORD } from '../index';
import ConfirmPasswordResetForm from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({
    recoverAccount: () => Promise.resolve(),
  });
});

describe('<ConfirmPasswordResetForm />', () => {
  it('should render without crashing', async () => {
    await act(async () => {
      await render(<ConfirmPasswordResetForm />);
    });
  });

  /*
  it('should redirect to Login after successfull password reset', async () => {
    await act(async () => {
      const validPassword = '1asdfghj';

      const history = createMemoryHistory({
        initialEntries: [RESET_PASSWORD.clientPath],
      });

      const {
        container,
        getByTestId,
      } = await render(<ConfirmPasswordResetForm />, { history });
      const submitButton = getByTestId('submit-button');

      expect(history.location.pathname).toBe(RESET_PASSWORD.clientPath);
      expect(submitButton.disabled).toBe(true);

      container.querySelectorAll('input[type="password"]').forEach(input => {
        fireEvent.input(input, { target: { value: validPassword } });
      });

      expect(submitButton.disabled).toBe(false);

      fireEvent.click(submitButton);

      await waitFor(() => history.location.pathname === LOGIN.clientPath);
      console.log(container.outerHTML);
    });
  });
  */
});
