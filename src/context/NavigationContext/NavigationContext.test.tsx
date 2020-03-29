import React from 'react';

import { render } from '../../testUtils';
import NavigationContext from './NavigationContext';

describe('<NavigationContext />', () => {
  it('should render without crashing', () => {
    render(<NavigationContext />);
  });

  it('renders children', () => {
    const { getByTestId } = render(
      <NavigationContext>
        <h1 data-testid="hello-friend">hello friend</h1>
      </NavigationContext>
    );

    expect(getByTestId('hello-friend')).toBeInTheDocument();
  });
});
