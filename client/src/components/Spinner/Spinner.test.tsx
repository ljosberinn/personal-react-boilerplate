import React from 'react';

import { render, waitFor } from '../../testUtils';
import Spinner from './Spinner';

describe('<Spinner />', () => {
  it('should render without crashing', () => {
    render(<Spinner />);
  });

  it('should be optionally deferrable', async () => {
    const { container } = render(<Spinner timeout={500} />);

    expect(container).toBeEmpty();

    await waitFor(() => expect(container).not.toBeEmpty(), { timeout: 750 });
  });
});
