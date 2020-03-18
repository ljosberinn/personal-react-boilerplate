import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import ValidityIcon, { iconMap } from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const invalidMail = 'a';
const invalidPassword = 'a';

const validMail = 'some@mail.com';
const validPassword = '1abcdefg';

describe('<ValidityIcon />', () => {
  ['left', 'right'].forEach(align => {
    Object.keys(iconMap).forEach(type => {
      it('renders without crashing', () => {
        const { container } = render(
          <ValidityIcon align={align} type={type} value="" />,
        );

        const classList = container.querySelector('.icon').classList;

        expect(classList.contains(`is-${align}`)).toBe(true);
        expect(classList.contains('has-text-danger')).toBe(false);
        expect(classList.contains('has-text-success')).toBe(false);
      });
    });

    it('renders without crashing given an invalid mail', () => {
      const { container } = render(
        <ValidityIcon align={align} type="mail" value={invalidMail} />,
      );

      const classList = container.querySelector('.icon').classList;

      expect(classList.contains('has-text-danger')).toBe(true);
      expect(classList.contains(`is-${align}`)).toBe(true);
    });

    it('renders without crashing given an valid mail', () => {
      const { container } = render(
        <ValidityIcon align={align} type="mail" value={validMail} />,
      );

      const classList = container.querySelector('.icon').classList;

      expect(classList.contains('has-text-success')).toBe(true);
      expect(classList.contains(`is-${align}`)).toBe(true);
    });

    it('renders without crashing given an invalid password', () => {
      const { container } = render(
        <ValidityIcon align={align} type="password" value={invalidPassword} />,
      );

      const classList = container.querySelector('.icon').classList;

      expect(classList.contains('has-text-danger')).toBe(true);
      expect(classList.contains(`is-${align}`)).toBe(true);
    });

    it('renders without crashing given an valid password', () => {
      const { container } = render(
        <ValidityIcon align={align} type="password" value={validPassword} />,
      );

      const classList = container.querySelector('.icon').classList;

      expect(classList.contains('has-text-success')).toBe(true);
      expect(classList.contains(`is-${align}`)).toBe(true);
    });
  });
});
