import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Checkbox from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Checkbox {...rest} />;

describe('<Checkbox />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });

  it('is always of type input[type="checkbox"]', () => {
    const { getByTestId } = render(<Intercepti18n />);

    const checkbox = getByTestId('checkbox');

    expect(checkbox).toBeInstanceOf(HTMLInputElement);
    expect(checkbox.getAttribute('type')).toBe('checkbox');
  });

  it('always has the class "is-checkradio"', () => {
    const { getByTestId } = render(<Intercepti18n />);

    expect(getByTestId('checkbox').classList.contains('is-checkradio')).toBe(
      true,
    );
  });

  ['small', 'medium', 'large'].forEach(size => {
    it(`is optionally of size '${size}'`, () => {
      const { getByTestId } = render(<Intercepti18n size={size} />);

      expect(getByTestId('checkbox').classList.contains(`is-${size}`)).toBe(
        true,
      );
    });
  });

  it('is optionally circled', () => {
    const { getByTestId } = render(<Intercepti18n circled />);

    expect(getByTestId('checkbox').classList.contains('is-circle')).toBe(true);
  });

  it('is optionally borderless', () => {
    const { getByTestId } = render(<Intercepti18n borderless />);

    expect(getByTestId('checkbox').classList.contains('has-no-border')).toBe(
      true,
    );
  });

  it('is optionally blocked', () => {
    const { getByTestId } = render(<Intercepti18n blocked />);

    expect(getByTestId('checkbox').classList.contains('is-blocked')).toBe(true);
  });

  ['small', 'medium', 'large'].forEach(size => {
    it(`accepts multiple conditions at the same time (size '${size}')`, () => {
      const { getByTestId } = render(
        <Intercepti18n borderless blocked circled size={size} />,
      );

      const checkbox = getByTestId('checkbox').classList;

      expect(checkbox.contains(`is-${size}`)).toBe(true);
      expect(checkbox.contains('is-blocked')).toBe(true);
      expect(checkbox.contains('is-circle')).toBe(true);
      expect(checkbox.contains('has-no-border')).toBe(true);
    });
  });
});
