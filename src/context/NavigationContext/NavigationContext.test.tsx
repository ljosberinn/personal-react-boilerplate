import React from 'react';

import { render } from '../../testUtils';
import NavigationProvider from './NavigationContext';

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
