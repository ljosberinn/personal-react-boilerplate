import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render, fireEvent } from '../../utils/testUtils';

import Switch from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Switch {...rest} />;

describe('<Switch />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });

  it('should render a input[type="checkbox"] wrapped in a label', () => {
    const { getByTestId } = render(<Intercepti18n />);

    expect(getByTestId('switch-label')).toBeInstanceOf(HTMLLabelElement);

    const checkbox = getByTestId('switch-checkbox');

    expect(checkbox).toBeInstanceOf(HTMLInputElement);
    expect(checkbox.getAttribute('type')).toBe('checkbox');
  });

  it('always has the class "switch" on its label', () => {
    const { getByTestId } = render(<Intercepti18n />);

    expect(getByTestId('switch-label').classList.contains('switch')).toBe(true);
  });

  [('small', 'medium', 'large')].forEach(size => {
    it(`is optionally of size "${size}"`, () => {
      const { getByTestId } = render(<Intercepti18n size={size} />);

      expect(getByTestId('switch-label').classList.contains(`is-${size}`)).toBe(
        true,
      );
    });
  });

  it('should can be optionally disabled', () => {
    const { getByTestId } = render(<Intercepti18n disabled />);

    expect(getByTestId('switch-label').classList.contains('is-disabled')).toBe(
      true,
    );
    expect(getByTestId('switch-checkbox').disabled).toBe(true);
  });

  it('should optionally be rounded', () => {
    const { getByTestId } = render(<Intercepti18n rounded />);

    expect(getByTestId('switch-label').classList.contains('is-rounded')).toBe(
      true,
    );
  });

  it('should optionally be outlined', () => {
    const { getByTestId } = render(<Intercepti18n outlined />);

    expect(getByTestId('switch-label').classList.contains('is-outlined')).toBe(
      true,
    );
  });

  it('triggers the given onChange function', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(<Intercepti18n onChange={onChange} />);

    fireEvent.click(getByTestId('switch-checkbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('can optionally be colored', () => {
    const { container } = render(<Intercepti18n color="danger" />);

    expect(container.querySelector('.is-danger')).not.toBe(null);
  });

  it('displays its label text', () => {
    const { findByLabelText } = render(<Intercepti18n text="hello friend" />);

    expect(findByLabelText(/hello friend/)).not.toBe(null);
  });
});
