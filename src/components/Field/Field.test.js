import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Field from '.';

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Field {...rest} />;

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<Field />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });

  it('should optionally float', () => {
    const { getByTestId } = render(<Intercepti18n floating />);

    expect(getByTestId('field').classList.contains('is-floating-label')).toBe(
      true,
    );
  });
});
