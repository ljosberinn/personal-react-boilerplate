import React from 'react';
import {
  FaDiscord,
  FaGithub,
  FaBookReader,
  FaHome,
  FaUserEdit,
  FaSignInAlt,
} from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Icon from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const icons = [
  FaDiscord,
  FaGithub,
  FaBookReader,
  FaHome,
  FaUserEdit,
  FaSignInAlt,
];

// required because Icon spreads props
const Intercepti18n = ({ i18n, t, tReady, ...rest }) => <Icon {...rest} />;

describe('<Icon />', () => {
  icons.forEach(icon => {
    it('should render without crashing given any icon', () => {
      render(<Intercepti18n svg={icon} />);
    });

    it('should always wrap an svg in an RBX.Icon', () => {
      const { getByTestId } = render(<Intercepti18n svg={icon} />);

      expect(getByTestId('icon-rbx-wrap')).toBeInTheDocument();
    });

    it('should always have aria-hidden & focusable="false" on svgs', () => {
      const { container } = render(<Intercepti18n svg={icon} />);

      const svg = container.querySelector('svg');

      expect(svg.getAttribute('focusable')).toBe('false');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
