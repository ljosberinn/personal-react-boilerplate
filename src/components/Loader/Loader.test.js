import React from 'react';
import { FaDiscord } from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';

import { render, waitFor } from '../../utils/testUtils';

import Loader from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const testId = 'loader';

describe('<Loader />', () => {
  it('should render without crashing', () => {
    render(<Loader />);
  });

  it('should not cover the full page by default', () => {
    const { getByTestId } = render(<Loader />);

    expect(getByTestId(testId).classList.contains('is-full-page')).toBe(false);
  });

  it('should optionally cover the full page', () => {
    const { getByTestId } = render(<Loader isFullPage />);

    expect(getByTestId(testId).classList.contains('is-full-page')).toBe(true);
  });

  it('should not render a special icon by default', () => {
    const { container } = render(<Loader />);

    expect(container.querySelector('.icon')).toBe(null);
  });

  it('should optionally accept an icon to overwrite the default icon', () => {
    const { container } = render(<Loader icon={FaDiscord} />);

    expect(container.querySelector('.loading-icon')).toBe(null);
    expect(container.querySelector('.icon')).not.toBe(null);
  });

  it('should have the optionally passed icon spinning', () => {
    const { container } = render(<Loader icon={FaDiscord} />);

    expect(container.querySelector('.icon.fa-spin')).not.toBe(null);
  });

  it('should be optionally deferrable', async () => {
    const { container, getByTestId } = render(<Loader defer />);

    expect(container.querySelector(`[data-testid="${testId}"]`)).toBe(null);

    await waitFor(() => getByTestId(testId) === null, { timeout: 1550 });

    expect(getByTestId(testId)).not.toBe(null);
  });
});
