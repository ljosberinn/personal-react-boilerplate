import { render } from '@testing-library/react';
import React from 'react';

import PrivacyPolicy from './PrivacyPolicy';

describe('<PrivacyPolicy />', () => {
  it('should render without crashing', () => {
    render(<PrivacyPolicy />);
  });
});
