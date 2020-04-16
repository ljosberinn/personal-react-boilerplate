import * as React from 'react';

import { render, fireEvent } from '../../../../testUtils';
import Unauthenticated from './Unauthenticated';

describe('<Unauthenticated />', () => {
  it('should render without crashing', () => {
    render(<Unauthenticated />);
  });

  it('renders a button that triggers login onClick', () => {
    const loginWithPopup = jest.fn();

    const { container } = render(<Unauthenticated />, {
      authProviderProps: {
        loginWithPopup,
      },
    });

    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(loginWithPopup).toHaveBeenCalledTimes(1);
  });
});
