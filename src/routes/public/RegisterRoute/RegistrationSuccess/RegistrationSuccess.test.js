import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';

import RegistrationSuccess from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const mail = 'some@mail.com';

describe('<RegistrationSuccess />', () => {
  it('renders without crashing', () => {
    render(<RegistrationSuccess mail={mail} />);
  });

  it('should hint the passed mail', () => {
    const { getByTestId } = render(<RegistrationSuccess mail={mail} />);

    expect(getByTestId('registration-success-mail-hint').textContent).toBe(
      mail,
    );
  });
});
