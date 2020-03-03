import React from 'react';

import render from '../../utils/testUtils';

import SentryErrorBoundary from '.';

const TestButton = () => <button type="button">test</button>;

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
});
