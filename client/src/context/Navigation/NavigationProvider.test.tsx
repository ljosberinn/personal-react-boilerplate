import React from 'react';

import { render } from '../../testUtils';
import NavigationProvider, { computeCurrentRoutes } from './NavigationProvider';

describe('<NavigationProvider />', () => {
  it('should render without crashing', () => {
    render(<NavigationProvider />);
  });

  it('renders children', () => {
    const { getByTestId } = render(
      <NavigationProvider>
        <h1 data-testid="hello-friend">hello friend</h1>
      </NavigationProvider>
    );

    expect(getByTestId('hello-friend')).toBeInTheDocument();
  });
});

describe('computeCurrentRoutes fn', () => {
  test('should only expose public & shared shared routes given false', () => {
    const { DASHBOARD, INDEX, PRIVACY_POLICY } = computeCurrentRoutes(false);

    expect(DASHBOARD).toBe(undefined);
    expect(INDEX).not.toBe(undefined);
    expect(PRIVACY_POLICY).not.toBe(undefined);
  });

  test('should only expose private & shared shared routes given true', () => {
    const { DASHBOARD, INDEX, PRIVACY_POLICY } = computeCurrentRoutes(true);

    expect(DASHBOARD).not.toBe(undefined);
    expect(INDEX).toBe(undefined);
    expect(PRIVACY_POLICY).not.toBe(undefined);
  });
});
