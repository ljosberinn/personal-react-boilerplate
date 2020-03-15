import React from 'react';

import render from '../../utils/testUtils';

import Field from '.';

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Field {...rest} />;

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
