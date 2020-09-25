import { render } from '@testing-library/react';

import NotFound from '../../../pages/404';

describe('<NotFound />', () => {
  it('renders without crashing', () => {
    render(<NotFound />);
  });
});
