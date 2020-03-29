import React from 'react';

import App from './App';
import { render } from './testUtils';

describe('<App />', () => {
  it('should render without crashing', () => {
    render(<App />);
  });
});
