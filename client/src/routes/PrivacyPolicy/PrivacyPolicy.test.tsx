import React from 'react';

import { render } from '../../testUtils';
import PrivacyPolicy from './PrivacyPolicy';

describe('<PrivacyPolicy />', () => {
  it('should render without crashing', () => {
    render(<PrivacyPolicy />);
  });
});
