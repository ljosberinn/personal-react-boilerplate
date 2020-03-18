import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Radio from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Radio {...rest} />;

describe('<Radio />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });

  it('should be of type input[type="radio"]', () => {
    const { getByTestId } = render(<Intercepti18n />);

    const radio = getByTestId('radio');

    expect(radio).toBeInstanceOf(HTMLInputElement);
    expect(radio.getAttribute('type')).toBe('radio');
  });

  it('should always have the class "is-checkradio"', () => {
    const { getByTestId } = render(<Intercepti18n />);

    expect(getByTestId('radio').classList.contains('is-checkradio')).toBe(true);
  });
});
