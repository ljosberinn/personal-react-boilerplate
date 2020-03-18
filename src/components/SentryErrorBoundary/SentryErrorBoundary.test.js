import { waitFor } from '@testing-library/react';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import SentryErrorBoundary from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

beforeEach(() => {
  jest.spyOn(console, 'error');
  console.error.mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

const TestButton = () => <button type="button">test</button>;
const CrashingButton = () => {
  throw new Error('test');
};

describe('<SentryErrorBoundary />', () => {
  it('should render without crashing', () => {
    render(
      <SentryErrorBoundary>
        <TestButton />
      </SentryErrorBoundary>,
    );
  });

  it('should render not render UI without a caught error', () => {
    const { container } = render(
      <SentryErrorBoundary>
        <TestButton />
      </SentryErrorBoundary>,
    );

    expect(container.innerHTML).toEqual('<button type="button">test</button>');
  });

  it('should render an alternative UI when catching an error', async () => {
    const { container } = render(
      <SentryErrorBoundary>
        <CrashingButton />
      </SentryErrorBoundary>,
    );

    expect.any(Error);

    expect(console.error).toHaveBeenCalledTimes(2);

    await waitFor(() => container.innerHTML !== '');
  });
});
