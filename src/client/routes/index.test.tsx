import React from 'react';

import Index from '../../../pages';
import { render, act } from '../../../testUtils';

describe('<Index />', () => {
  /**
   * when using chakra, components such as Popover or Menu will have effects -
   * to catch them, we need to do this stupid async dance here despite nothing
   * actually being a promise
   */
  it('renders without crashing', async () => {
    await act(async () => {
      await render(<Index />);
    });
  });
});
